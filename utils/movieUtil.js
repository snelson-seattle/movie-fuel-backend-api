require("dotenv").config({ path: require("find-config")(".env") });
var key = process.env.TMDB_accessToken;
const baseURL = "https://api.themoviedb.org/3/movie";
const imagePath = "https://image.tmdb.org/t/p/original";
const tmdbHeaders = {
  accept: "application/json",
  Authorization: "Bearer " + key,
};

async function getNowPlayingMovies() {
  var fetch = require("node-fetch");
  const path = "/now_playing?language=en-US&page=1";
  const options = {
    method: "GET",

    headers: tmdbHeaders,
  };

  try {
    const response = await fetch(baseURL + path, options);
    const json = await response.json();
    const movies = json.results.map((result) => {
      result.backdrop_path = imagePath + result.backdrop_path;
      result.poster_path = imagePath + result.poster_path;
      return result;
    });
    return movies;
  } catch (error) {
    console.error(error);
    return { message: "Something went wrong" };
  }
}

function searchDataBaseByQuery(query, language, page) {
  if (language === void 0) {
    language = "en-US";
  }
  if (page === void 0) {
    page = 1;
  }
  var fetch = require("node-fetch");
  var url = "https://api.themoviedb.org/3/search/movie?query="
    .concat(query, "&include_adult=false&language=")
    .concat(language, "&page=")
    .concat(page);
  var options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer ".concat(key),
    },
  };
  var data = new Promise(function (resolve, reject) {
    fetch(url, options)
      .then(function (res) {
        return res.json();
      })
      .then(function (json) {
        resolve(json);
      })
      .catch(function (err) {
        resolve({ message: "Something went wrong" });
      });
  });
  return data;
}
function searchDataBaseByID(id) {
  var fetch = require("node-fetch");
  var url = "https://api.themoviedb.org/3/movie/".concat(id);
  var options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer ".concat(key),
    },
  };
  var data = new Promise(function (resolve, reject) {
    fetch(url, options)
      .then(function (res) {
        return res.json();
      })
      .then(function (json) {
        resolve(json);
      })
      .catch(function (err) {
        resolve({ message: "Something went wrong" });
      });
  });
  return data;
}
function getDirectorByID(id) {
  var fetch = require("node-fetch");
  var url = `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`;
  var options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer ".concat(key),
    },
  };
  var data = new Promise(function (resolve, reject) {
    fetch(url, options)
      .then(function (res) {
        return res.json();
      })
      .then(function (json) {
        json = json.crew.filter(({ job }) => job === "Director");
        resolve(json);
      })
      .catch(function (err) {
        resolve({ message: "Something went wrong" });
      });
  });
  return data;
}
// filtered search
function filteredSearchSimple(
  genresInclude,
  genresExclude,
  sortBy,
  sortdir,
  page
) {
  var fetch = require("node-fetch");
  console.log(String(sortBy));
  var url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&with_genres=${genresInclude}&without_genres=${genresExclude}&sort_by=${sortBy}.${sortdir}`;
  console.log(url);
  var options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer ".concat(key),
    },
  };
  var data = new Promise(function (resolve, reject) {
    fetch(url, options)
      .then(function (res) {
        return res.json();
      })
      .then(function (json) {
        resolve(json);
      })
      .catch(function (err) {
        resolve({ message: "Something went wrong" });
      });
  });
  return data;
}
// get images "https://image.tmdb.org/t/p/original
function getImagesByID(id) {
  var fetch = require("node-fetch");
  var url = "https://api.themoviedb.org/3/movie/".concat(
    id,
    "/images?include_image_language=en&language=en"
  );
  var options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer ".concat(key),
    },
  };
  var data = new Promise(function (resolve, reject) {
    fetch(url, options)
      .then(function (res) {
        return res.json();
      })
      .then(function (json) {
        resolve(json);
      })
      .catch(function (err) {
        resolve({ message: "Something went wrong" });
      });
  });
  return data;
}
function buildImageURL(path) {
  return "https://image.tmdb.org/t/p/original" + path;
}
// filteredSearchSimple("12","28,18",1)
// .then((data) => {
//     console.log(data)
// })
// .catch(err => console.error('error:' + err));
// searchDataBaseByID(330457)
//     .then(function (data) {
//     console.log(data);
//     console.log(buildImageURL(data.posters[0].file_path));
// })
//     .catch(function (err) { return console.error('error:' + err); });
module.exports = {
  getDirectorByID,
  searchDataBaseByQuery,
  searchDataBaseByID,
  filteredSearchSimple,
  getNowPlayingMovies,
  getImagesByID,
  buildImageURL,
};
