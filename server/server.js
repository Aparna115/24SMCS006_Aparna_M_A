const express = require("express");
const path = require("path");
const fs = require("fs"); // Added to read the file

const app = express();

// Path to your database file
const MOVIES_FILE = path.join(__dirname, 'movies_metadata.json');

// Helper function to read the data
const loadMovies = () => {
  try {
    const data = fs.readFileSync(MOVIES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading file:", err);
    return [];
  }
};

// A test route to make sure the server is up.
app.get("/api/ping", (request, response) => {
  console.log("❇️ Received GET request to /api/ping");
  response.send("pong!");
});

// 1. List Movies Route (Replaces your old mock route)
app.get("/api/movies", (request, response) => {
  console.log("❇️ Received GET request to /api/movies");
  const movies = loadMovies();
  
  // Send back just the list data needed
  const listData = movies.map(movie => ({
    id: movie.id,
    title: movie.title,
    tagline: movie.tagline,
    vote_average: movie.vote_average
  }));
  
  response.json(listData);
});

// 2. Single Movie Detail Route (New requirement)
app.get("/api/movies/:id", (request, response) => {
  console.log(`❇️ Received GET request to /api/movies/${request.params.id}`);
  const movies = loadMovies();
  // Find the movie that matches the ID
  const movie = movies.find(m => m.id == request.params.id);

  if (movie) {
    response.json(movie);
  } else {
    response.status(404).json({ message: "Movie not found" });
  }
});

// Express port-switching logic (KEPT FROM YOUR ORIGINAL FILE)
let port;
console.log("❇️ NODE_ENV is", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  port = process.env.PORT || 3000;
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "../build", "index.html"));
  });
} else {
  port = 3001;
  console.log("⚠️ Not seeing your changes as you develop?");
  console.log(
    "⚠️ Do you need to set 'start': 'npm run development' in package.json?"
  );
}

// Start the listener!
const listener = app.listen(port, () => {
  console.log("❇️ Express server is running on port", listener.address().port);
});