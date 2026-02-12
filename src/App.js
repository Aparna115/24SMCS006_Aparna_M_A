import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [view, setView] = useState('list');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to fix the "30/10/95" date format issue
  const parseDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    try {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        // Handle 2-digit years (assume 90s are 1990s)
        let year = parseInt(parts[2]);
        if (year < 100) year += year < 50 ? 2000 : 1900;
        
        const date = new Date(year, parseInt(parts[1]) - 1, parseInt(parts[0]));
        return date.toLocaleDateString();
      }
      return dateString; // Fallback
    } catch (e) {
      return dateString;
    }
  };

  useEffect(() => {
    async function getMovies() {
      try {
        setLoading(true);
        const response = await fetch('/api/movies');
        const data = await response.json();
        setMovies(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    }
    getMovies();
  }, []);

  const handleMovieClick = async (id) => {
    try {
      const response = await fetch(`/api/movies/${id}`);
      const data = await response.json();
      setSelectedMovie(data);
      setView('detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const handleBack = () => {
    setView('list');
    setSelectedMovie(null);
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return '#4caf50'; 
    if (rating >= 6) return '#ff9800'; 
    return '#f44336'; 
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎬 Movie Database</h1>
        <p>Browse your favorite classic collection</p>
      </header>
      
      <main className="App-main">
        {loading && <div className="loader">Loading Movies...</div>}

        {/* --- LIST VIEW --- */}
        {!loading && view === 'list' && (
          <div className="movie-grid animate-fade-in">
            {movies.map((movie, index) => (
              <div 
                key={movie.id} 
                className="movie-card" 
                onClick={() => handleMovieClick(movie.id)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="card-content">
                  <h3>{movie.title}</h3>
                  {movie.tagline && <p className="tagline">"{movie.tagline}"</p>}
                </div>
                
                <div className="card-footer">
                  <div 
                    className="rating-badge"
                    style={{ backgroundColor: getRatingColor(movie.vote_average) }}
                  >
                    {movie.vote_average}
                  </div>
                  <span className="details-link">View Details &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- DETAIL VIEW --- */}
        {view === 'detail' && selectedMovie && (
          <div className="movie-detail animate-slide-up">
            <button className="back-btn" onClick={handleBack}>
              &larr; Back to Movies
            </button>
            
            <div className="detail-header">
              <h2>{selectedMovie.title}</h2>
            </div>

            {/* UPDATED: Colorful Text Labels instead of Icons */}
            <div className="detail-meta-container">
               <div className="meta-box">
                 <span className="label-text color-blue">Runtime</span>
                 <span className="value-text">{selectedMovie.runtime} min</span>
               </div>
               
               <div className="meta-box">
                 <span className="label-text color-gold">Rating</span>
                 <span className="value-text">{selectedMovie.vote_average} / 10</span>
               </div>

               <div className="meta-box">
                 <span className="label-text color-purple">Released</span>
                 <span className="value-text">{parseDate(selectedMovie.release_date)}</span>
               </div>
            </div>
            
            {selectedMovie.tagline && (
              <div className="detail-tagline">
                "{selectedMovie.tagline}"
              </div>
            )}

            {/* UPDATED: Boxed Overview Container */}
            <div className="overview-container">
              <h3 className="overview-title">Overview</h3>
              <p className="overview-text">{selectedMovie.overview}</p>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default App;