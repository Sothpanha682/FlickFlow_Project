document.addEventListener('DOMContentLoaded', async () => {
    let movies = [];
    const topRatedMoviesSlideshow = document.getElementById('topRatedMoviesSlideshow');
    const allMoviesGrid = document.getElementById('allMoviesGrid'); // This is correct for index.html
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
        container.appendChild(movieCard);
    }

    let currentSlideIndex = 0; // Track the current active slide

    // Removed updateSlideClasses function as per user request (no animation)

    function renderTopRatedMovies(allMovies) {
        const sortedMovies = [...allMovies].sort((a, b) => b.rating - a.rating);
        const top5Movies = sortedMovies.slice(0, 5);

        if (!topRatedMoviesSlideshow) return; // Ensure element exists

        topRatedMoviesSlideshow.innerHTML = '';

        if (top5Movies.length > 0) {
            top5Movies.forEach(movie => {
                renderMovieCard(movie, topRatedMoviesSlideshow);
            });
            // After rendering, ensure the first slide is visible immediately
            currentSlideIndex = 0; // Start with the first slide
            if (topRatedMoviesSlideshow.scrollWidth > topRatedMoviesSlideshow.clientWidth) {
                topRatedMoviesSlideshow.scrollTo({
                    left: currentSlideIndex * topRatedMoviesSlideshow.clientWidth,
                    behavior: 'smooth' // Smooth behavior
                });
            }
        } else {
            topRatedMoviesSlideshow.innerHTML = '<p>No top-rated movies available.</p>';
        }
    }

    // Declare slideshow variables in the outer scope
    let slideshowInterval;
    const slideshowContainer = document.querySelector('.full-width-slideshow-wrapper .movie-section'); // The parent for buttons

    // Re-adding prevButton as per user request
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '&#10094;'; // Left arrow
    prevButton.classList.add('slideshow-nav', 'prev');
    if (slideshowContainer) slideshowContainer.appendChild(prevButton); 
    
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '&#10095;'; // Right arrow
    nextButton.classList.add('slideshow-nav', 'next');
    if (slideshowContainer) slideshowContainer.appendChild(nextButton); 

    const startSlideshow = () => {
        if (!topRatedMoviesSlideshow) return; // Ensure element exists
        const movieCards = topRatedMoviesSlideshow.querySelectorAll('custom-movie-card');
        if (movieCards.length === 0) return;

        const slideshowWidth = topRatedMoviesSlideshow.clientWidth; // Get width dynamically

        slideshowInterval = setInterval(() => {
            currentSlideIndex = (currentSlideIndex + 1) % movieCards.length;
            topRatedMoviesSlideshow.scrollTo({
                left: currentSlideIndex * slideshowWidth,
                behavior: 'smooth' // Smooth transition
            });
            // No updateSlideClasses as per user request (no animation)
        }, 4000); // Flip every 4 seconds
    };

    const resetSlideshowInterval = () => {
        clearInterval(slideshowInterval);
        startSlideshow();
        // No updateSlideClasses as per user request (no animation)
    };

    if (prevButton) { 
        prevButton.addEventListener('click', () => {
            if (!topRatedMoviesSlideshow) return;
            const movieCards = topRatedMoviesSlideshow.querySelectorAll('custom-movie-card');
            if (movieCards.length === 0) return;

            const slideshowWidth = topRatedMoviesSlideshow.clientWidth;
            currentSlideIndex = (currentSlideIndex - 1 + movieCards.length) % movieCards.length; // Loop backwards
            topRatedMoviesSlideshow.scrollTo({
                left: currentSlideIndex * slideshowWidth,
                behavior: 'smooth' // Smooth transition
            });
            resetSlideshowInterval();
        });
    }

    if (nextButton) { 
        nextButton.addEventListener('click', () => {
            if (!topRatedMoviesSlideshow) return;
            const movieCards = topRatedMoviesSlideshow.querySelectorAll('custom-movie-card');
            if (movieCards.length === 0) return;

            const slideshowWidth = topRatedMoviesSlideshow.clientWidth;
            currentSlideIndex = (currentSlideIndex + 1) % movieCards.length;
            topRatedMoviesSlideshow.scrollTo({
                left: currentSlideIndex * slideshowWidth,
                behavior: 'smooth' // Smooth transition
            });
            resetSlideshowInterval();
        });
    }

    function renderAllMovies(allMovies) {
        if (!allMoviesGrid) return; // Ensure element exists
        allMoviesGrid.innerHTML = '';
        allMovies.forEach(movie => {
            renderMovieCard(movie, allMoviesGrid);
        });
    }

    document.addEventListener('movieSubmitted', (e) => {
        const newMovie = e.detail;
        movies.push(newMovie);
        saveMovies(movies); // Persist to localStorage
        renderTopRatedMovies(movies);
        renderAllMovies(movies);
    });

    document.addEventListener('movieUpdated', (e) => {
        const updatedMovie = e.detail;
        const index = movies.findIndex(m => m.id === updatedMovie.id);
        if (index !== -1) {
            movies[index] = updatedMovie;
            saveMovies(movies); // Persist to localStorage
            renderTopRatedMovies(movies);
            renderAllMovies(movies);
        }
    });

    // Listen for 'deleteMovie' event to update display if movies are deleted on dashboard
    document.addEventListener('deleteMovie', (e) => {
        const movieIdToDelete = e.detail.movieId;
        movies = movies.filter(movie => movie.id !== movieIdToDelete);
        saveMovies(movies); // Persist to localStorage
        renderTopRatedMovies(movies);
        renderAllMovies(movies);
    });

    // Initial load and render
    movies = await loadMovies();
    if (topRatedMoviesSlideshow) {
        renderTopRatedMovies(movies);
        startSlideshow(); // Start the slideshow initially after rendering
    }
    if (allMoviesGrid) {
        renderAllMovies(movies);
    }
});
