import {searchDataBaseByQuery, getDirectorByID, searchDataBaseByID, filteredSearchSimple,getImagesByID,getNowPlayingMovies,buildImageURL} from "../movieUtil.js";
var fetch = require("node-fetch");
jest.mock("node-fetch", () => jest.fn());
fetch.mockImplementation((input) => 
Promise.resolve({
    json: jest.fn().mockReturnValue({
        data: input, results: [{backdrop_path: "foo", poster_path: "bar", data: input}], crew: [{job:"Director",data:input}]
    }),
}))
afterEach(() => {
    jest.clearAllMocks();
  });
test("buildImageURL should return a string representation of the tmdb url required to get that image", () => {
    const imagePath = "/rMvPXy8PUjj1o8o1pzgQbdNCsvj.jpg"
    const builturl = buildImageURL(imagePath);
    expect(builturl).toBe('https://image.tmdb.org/t/p/original/rMvPXy8PUjj1o8o1pzgQbdNCsvj.jpg')
    expect(typeof builturl).toBe("string")
})
test("searchDataBaseByQuery should call the tmdb api once with the provided parameters", async () => {
    const query = 'barbie';
    const language = 'en-US';
    const page = 2;
    const result = await searchDataBaseByQuery(query,language,page);
    expect(result.data).toBe(
        'https://api.themoviedb.org/3/search/movie?query=barbie&include_adult=false&language=en-US&page=2'
      )
    expect(fetch).toHaveBeenCalledTimes(1)
})
test("searchDataBaseByQuery should not need page and language argumnts", async () => {
    const query = 'barbie';
    const result = await searchDataBaseByQuery(query);
    expect(result.data).toBe(
        'https://api.themoviedb.org/3/search/movie?query=barbie&include_adult=false&language=en-US&page=1'
      )
    expect(fetch).toHaveBeenCalledTimes(1)
})
test("searchDataBaseByID should call the tmdb api once with the provided parameters", async () => {
    const ID = '1';
    const result = await searchDataBaseByID(ID);
    expect(result.data).toBe(
        'https://api.themoviedb.org/3/movie/1'
      )
    expect(fetch).toHaveBeenCalledTimes(1)
})
test("getDirectorByID should call the tmdb api once with the provided parameters", async () => {
    const ID = '1';
    const result = await getDirectorByID(ID);
    console.log(result)
    expect(result[0].data).toBe(
        'https://api.themoviedb.org/3/movie/1/credits?language=en-US'
      )
    expect(fetch).toHaveBeenCalledTimes(1)
})
test("filteredSearchSimple should call the tmdb api once with the provided parameters", async () => {
    const genresInclude = "1,2,3";
    const genresExclude = "4,5,6";
    const sortby = "revenue";
    const sortdir = "desc";
    const page = 1;
    const result = await filteredSearchSimple(genresInclude,genresExclude,sortby,sortdir,page);
    expect(result.data).toBe(
        'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&with_genres=1,2,3&without_genres=4,5,6&sort_by=revenue.desc'
      )
    expect(fetch).toHaveBeenCalledTimes(1)
})
test("getNowPlaying should call the tmdb api once", async () => {
    const result = await getNowPlayingMovies();
    console.log(result)
    expect(result[0].data).toBe(
        'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1'
      )
    expect(fetch).toHaveBeenCalledTimes(1)
})
test("searchImagesByID should call the tmdb api once with the provided parameters", async () => {
    const ID = '1';
    const result = await getImagesByID(ID);
    expect(result.data).toBe(
        'https://api.themoviedb.org/3/movie/1/images?include_image_language=en&language=en'
      )
    expect(fetch).toHaveBeenCalledTimes(1)
})




test("getNowPlaying should error when promise is rejected", async () => {
    fetch.mockImplementation((input) => 
    Promise.reject({
        json: jest.fn().mockReturnValue({
            data: input, results: [{backdrop_path: "foo", poster_path: "bar", data: input}]
        }),
    }))
    const result = await getNowPlayingMovies();
    expect(result.message).toBe("Something went wrong")
    expect(fetch).toHaveBeenCalledTimes(1)
})
test("searchImagesByID should error when promise is rejected", async () => {
    fetch.mockImplementation((input) => 
    Promise.reject({
        json: jest.fn().mockReturnValue({
            data: input, results: [{backdrop_path: "foo", poster_path: "bar", data: input}]
        }),
    }))
    const ID = '1';
    const result = await getImagesByID(ID);
    expect(result.message).toBe("Something went wrong")
    expect(fetch).toHaveBeenCalledTimes(1)
})
test("searchmoviesByID should error when promise is rejected", async () => {
    fetch.mockImplementation((input) => 
    Promise.reject({
        json: jest.fn().mockReturnValue({
            data: input, results: [{backdrop_path: "foo", poster_path: "bar", data: input}]
        }),
    }))
    const ID = '1';
    const result = await searchDataBaseByID(ID);
    expect(result.message).toBe("Something went wrong")
    expect(fetch).toHaveBeenCalledTimes(1)
})
test("getDirectorByID should error when promise is rejected", async () => {
    fetch.mockImplementation((input) => 
    Promise.reject({
        json: jest.fn().mockReturnValue({
            data: input, results: [{backdrop_path: "foo", poster_path: "bar", data: input}]
        }),
    }))
    const ID = '1';
    const result = await getDirectorByID(ID);
    expect(result.message).toBe("Something went wrong")
    expect(fetch).toHaveBeenCalledTimes(1)
})
test("searchmoviesByquery should error when promise is rejected", async () => {
    fetch.mockImplementation((input) => 
    Promise.reject({
        json: jest.fn().mockReturnValue({
            data: input, results: [{backdrop_path: "foo", poster_path: "bar", data: input}]
        }),
    }))
    const query = 'barbie';
    const language = 'en-US';
    const page = 2;
    const result = await searchDataBaseByQuery(query,language,page);
    expect(result.message).toBe("Something went wrong")
    expect(fetch).toHaveBeenCalledTimes(1)
})
test("filteredSearchSimple should error when promise is rejected", async () => {
    fetch.mockImplementation((input) => 
    Promise.reject({
        json: jest.fn().mockReturnValue({
            data: input, results: [{backdrop_path: "foo", poster_path: "bar", data: input}]
        }),
    }))
    const genresInclude = "1,2,3";
    const genresExclude = "4,5,6";
    const sortby = "revenue";
    const sortdir = "desc";
    const page = 1;
    const result = await filteredSearchSimple(genresInclude,genresExclude,sortby,sortdir,page);
    expect(result.message).toBe("Something went wrong")
    expect(fetch).toHaveBeenCalledTimes(1)
})