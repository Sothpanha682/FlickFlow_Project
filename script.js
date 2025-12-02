document.addEventListener('DOMContentLoaded', async () => {
    let movies = [];
    const allMoviesGrid = document.getElementById('moviesGrid');
    const addMovieBtn = document.getElementById('addMovieBtn');
    const modal = document.querySelector('custom-movie-modal');

    async function loadMovies() {
        // Try to load from localStorage first
        const storedMovies = localStorage.getItem('movies');
        if (storedMovies) {
            try {
                return JSON.parse(storedMovies);
            } catch (error) {
                console.error("Error parsing movies from localStorage, falling back to JSON file:", error);
                // Clear corrupted localStorage data
                localStorage.removeItem('movies');
            }
        }

        // If not in localStorage or parsing failed, fetch from movies.json
        try {
            const response = await fetch('movies.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const fetchedMovies = await response.json();
            saveMovies(fetchedMovies); // Save to localStorage after fetching
            return fetchedMovies;
        } catch (error) {
            console.error('Error loading movies:', error);
            return []; // Return empty array on error
        }
    }

    function saveMovies(moviesArray) {
        localStorage.setItem('movies', JSON.stringify(moviesArray));
    }

    function renderMovieCard(movie, container) {
        const movieCard = document.createElement('custom-movie-card');
        movieCard.setAttribute('movie-id', movie.id);
        movieCard.setAttribute('title', movie.title);
        movieCard.setAttribute('image-url', movie.imageUrl);
        movieCard.setAttribute('description', movie.description);
        movieCard.setAttribute('rating', movie.rating);
        movieCard.setAttribute('category', movie.category);
        movieCard.setAttribute('is-dashboard', 'true'); // Add this line
        container.appendChild(movieCard);
    }

    function renderAllMovies(allMovies) {
        allMoviesGrid.innerHTML = '';
        allMovies.forEach(movie => {
            renderMovieCard(movie, allMoviesGrid);
        });
    }

    // Listen for 'editMovie' event dispatched by movie cards
    document.addEventListener('editMovie', (e) => {
        console.log('Edit movie event received. Details:', e.detail);
        // Open modal for editing, passing the movie data
        modal.openModal(e.detail);
    });

    document.addEventListener('movieSubmitted', (e) => {
        const newMovie = e.detail;
        movies.push(newMovie);
        saveMovies(movies); // Persist to localStorage
        renderAllMovies(movies);
    });

    document.addEventListener('movieUpdated', (e) => {
        const updatedMovie = e.detail;
        const index = movies.findIndex(m => m.id === updatedMovie.id);
        if (index !== -1) {
            movies[index] = updatedMovie;
            saveMovies(movies); // Persist to localStorage
            renderAllMovies(movies);
        }
    });

    // Listen for 'deleteMovie' event
    document.addEventListener('deleteMovie', (e) => {
        const movieIdToDelete = parseInt(e.detail.movieId, 10); // Ensure ID is a number
        console.log('Delete movie event received for ID:', movieIdToDelete, 'Type:', typeof movieIdToDelete);
        
        // Add confirmation alert
        if (!confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
            console.log('Delete action cancelled by user.');
            return; // Stop if user cancels
        }

        console.log('Current movies before delete:', movies.map(m => m.id));

        const initialMoviesLength = movies.length;
        movies = movies.filter(movie => movie.id !== movieIdToDelete);
        console.log('Movies after filter:', movies.map(m => m.id));
        console.log('Number of movies changed:', initialMoviesLength !== movies.length);

        saveMovies(movies); // Persist to localStorage
        renderAllMovies(movies);
    });

    // Initial load and render
    movies = await loadMovies();
    if (allMoviesGrid) {
        renderAllMovies(movies);
    }

    if (addMovieBtn) {
        addMovieBtn.addEventListener('click', () => {
            modal.openModal(null); // Open modal for new movie (passing null or empty object)
        });
    }
});
