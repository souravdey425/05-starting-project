import React, { useState } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [waitingState, setWaitingState] = useState(false);
  const [errorState, setErrorState] = useState(null);
  async function fatchMovieHandler() {
    setErrorState(null);
    try {
      setWaitingState(true);
      const response = await fetch(
        "https://create-app-676b6-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) {
        throw new Error("Something Went wrong");
      }
      const data = await response.json();
      console.log(data);
      const loadedMovie = [];
      for (const key in data) {
        loadedMovie.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      // const textTransform = data.results.map((index) => {
      //   return {
      //     id: index.episode_id,
      //     title: index.title,
      //     releaseDate: index.release_date,
      //     openingText: index.opening_crawl,
      //   };
      // });
      setMovies(loadedMovie);
      setWaitingState(false);
    } catch (error) {
      setErrorState(error.message);
    }
    setWaitingState(false);
  }
  async function addMovieHandler(movie) {
    const response = await fetch(
      "https://create-app-676b6-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />

        <button onClick={fatchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
        {!waitingState && movies.length > 0 && <MoviesList movies={movies} />}
        {!waitingState && movies.length === 0 && <p>No Movie to Show</p>}
        {!waitingState && errorState && <p>{errorState}</p>}
        {waitingState && <p>is Loading...</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
