const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userDAO = require("../dao/userDAO");

router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ message: "Email, Username and Password are required fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      password: hashedPassword,
      email,
      role: "user",
    };

    await userDAO.addUser(newUser);

    // Create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: newUser.username,
          role: newUser.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "600s" }
    );

    const refreshToken = jwt.sign(
      { username: newUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Create a secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // expires in 1 week
    });

    // Return the access token
    res.status(201).json({ accessToken });
  } catch (error) {
    if (error.code === "ConditionalCheckFailedException") {
      return res.status(409).json({ message: "Username already exists" });
    }
    return res.status(500).json({ message: "Something went wrong." });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Both username and password are required fields" });
  }

  try {
    // Find user in the database
    const response = await userDAO.getUser(username);

    // Return if an existing user is not found
    if (!response) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check for matching password if existing user is found
    const matchingPassword = await bcrypt.compare(
      password,
      response.Item.password
    );
    // Return if the password doesn't match
    if (!matchingPassword) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: response.Item.username,
          role: response.Item.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "600s" }
    );

    const refreshToken = jwt.sign(
      { username: response.Item.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Create a secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // expires in 1 week
    });

    // Return the access token
    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

router.get("/refresh", async (req, res) => {
  const cookies = req.cookies;

  if (!cookies.jwt) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const refreshToken = cookies.jwt;

  // verify the refresh token
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      try {
        const existingUser = await userDAO.getUser(decoded.username);

        if (!existingUser)
          return res.status(401).json({ message: "Unauthorized" });

        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: existingUser.Item.username,
              role: existingUser.Item.role,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "600s" }
        );

        res.json({ accessToken });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
      }
    }
  );
});

router.post("/logout", (req, res) => {
  const cookies = req.cookies;

  if (cookies) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: false });
    return res.json({ message: "Cookie cleared" });
  }else{
    return res.sendStatus(204); // No content
  }

  
});

module.exports = router;
