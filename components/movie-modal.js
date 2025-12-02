class CustomMovieModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._visible = false;
        this._editingMovie = null; // To store the movie being edited
    }

    connectedCallback() {
        this.render();
    }

    // New method to set movie data for editing
    setMovie(movie) {
        this._editingMovie = movie;
        this.render(); // Re-render to update form fields
    }

    openModal(movie = null) {
        console.log('MovieModal: openModal called with movie:', movie);
        this._editingMovie = movie; // Set the movie for editing, or null for adding
        this._visible = true;
        this.render(); // Re-render with updated content
        // Event listeners are now added in _addEventListeners after render
    }

    closeModal() {
        this._visible = false;
        this._editingMovie = null; // Clear editing state
        this.render(); // Re-render to clear the modal
    }

    handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const movieData = {
            title: formData.get('title'),
            imageUrl: formData.get('imageUrl'),
            description: formData.get('description'),
            rating: parseFloat(formData.get('rating')),
            category: formData.get('category')
        };

        if (this._editingMovie && this._editingMovie.id) {
            // Update existing movie
            const updatedMovie = { id: this._editingMovie.id, ...movieData };
            console.log('MovieModal: Dispatching movieUpdated event with:', updatedMovie);
            this.dispatchEvent(new CustomEvent('movieUpdated', {
                bubbles: true,
                composed: true,
                detail: updatedMovie
            }));
        } else {
            // Add new movie
            const newMovie = { id: Date.now(), ...movieData };
            console.log('MovieModal: Dispatching movieSubmitted event with:', newMovie);
            this.dispatchEvent(new CustomEvent('movieSubmitted', {
                bubbles: true,
                composed: true,
                detail: newMovie
            }));
        }
        this.closeModal();
    }

    _addEventListeners() {
        const closeModalButton = this.shadowRoot.getElementById('closeModal');
        const cancelBtn = this.shadowRoot.getElementById('cancelBtn');
        const form = this.shadowRoot.getElementById('movieForm');
        const ratingInput = this.shadowRoot.getElementById('rating');
        const ratingLabel = this.shadowRoot.getElementById('ratingLabel');


        if (closeModalButton) closeModalButton.addEventListener('click', () => this.closeModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeModal());
        if (form) form.addEventListener('submit', (e) => this.handleSubmit(e));

        if (ratingInput && ratingLabel) {
            ratingInput.addEventListener('input', () => {
                ratingLabel.textContent = `Rating (${ratingInput.value})`;
                const starRating = this.shadowRoot.querySelector('.star-rating');
                if (starRating) {
                    starRating.innerHTML = this.renderStars(ratingInput.value);
                }
            });
        }
    }


    render() {
        if (!this._visible) {
            this.shadowRoot.innerHTML = '';
            return;
        }

        const isEditing = !!this._editingMovie;
        const modalTitle = isEditing ? 'Edit Movie' : 'Add New Movie';
        const submitButtonText = isEditing ? 'Save Changes' : 'Add Movie';
        const movie = this._editingMovie; // The movie object if editing, or null
        const currentRating = movie ? movie.rating : 3;

        console.log('MovieModal: Rendering modal. isEditing:', isEditing, 'Movie data:', movie, 'Current Rating:', currentRating);

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --primary-500: #6366f1;
                    --primary-600: #4f46e5;
                    --gray-100: #f3f4f6; /* For dark mode text */
                    --gray-300: #d1d5db; /* For dark mode label/text */
                    --gray-500: #6b7280; /* For light mode close button/text */
                    --gray-600: #4b5563; /* For dark mode border */
                    --gray-700: #374151; /* For light mode label/hover bg, dark mode input bg */
                    --gray-800: #1f2937; /* For dark mode modal background */
                    --gray-900: #111827; /* For light mode title text */
                    --white: #ffffff;
                    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                }

                .modal-backdrop {
                    position: fixed;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    z-index: 50;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    background-color: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(5px);
                }
                
                .modal-content {
                    background-color: var(--white);
                    border-radius: 0.75rem; /* rounded-xl */
                    box-shadow: var(--shadow-xl);
                    width: 100%;
                    max-width: 28rem; /* max-w-md */
                    max-height: 90vh;
                    overflow-y: auto;
                }

                html.dark .modal-content {
                    background-color: var(--gray-800);
                }
                
                .modal-padding {
                    padding: 1.5rem; /* p-6 */
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem; /* mb-4 */
                }

                .modal-title {
                    font-size: 1.25rem; /* text-xl */
                    font-weight: 700; /* font-bold */
                    color: var(--gray-900);
                    margin: 0; /* Remove default h3 margin */
                }

                html.dark .modal-title {
                    color: var(--white);
                }

                .close-button {
                    background: none;
                    border: none;
                    color: var(--gray-500);
                    transition: color 0.2s ease-in-out;
                    cursor: pointer;
                    font-size: 1.5rem; /* Larger icon */
                    display: flex; /* For centering emoji */
                    align-items: center;
                    justify-content: center;
                    line-height: 1; /* Adjust line height for emoji */
                }

                .close-button:hover {
                    color: var(--gray-700);
                }

                html.dark .close-button:hover {
                    color: var(--gray-300);
                }
                
                .form-section {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem; /* space-y-4 */
                }

                .form-group {
                    /* Individual form group styling if needed */
                }

                .input-label {
                    display: block;
                    font-size: 0.875rem; /* text-sm */
                    font-weight: 500; /* font-medium */
                    color: var(--gray-700);
                    margin-bottom: 0.25rem; /* mb-1 */
                }

                html.dark .input-label {
                    color: var(--gray-300);
                }

                .form-input, .form-select, .form-textarea {
                    width: 100%;
                    padding: 0.5rem 0.75rem; /* px-3 py-2 */
                    border: 1px solid var(--gray-300);
                    border-radius: 0.5rem; /* rounded-lg */
                    transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out, color 0.2s ease-in-out;
                    font-family: 'Inter', sans-serif; /* Inherit font */
                }

                .form-input:focus, .form-select:focus, .form-textarea:focus {
                    border-color: var(--primary-500);
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3); /* focus:ring-primary-500 */
                }

                html.dark .form-input, html.dark .form-select, html.dark .form-textarea {
                    border-color: var(--gray-600);
                    background-color: var(--gray-700);
                    color: var(--white);
                }

                .rating-group {
                    display: flex;
                    align-items: center;
                    gap: 1rem; /* gap-4 */
                }

                .rating-input {
                    flex: 1; /* flex-1 */
                    -webkit-appearance: none;
                    appearance: none;
                    height: 8px;
                    background: var(--gray-300);
                    border-radius: 5px;
                    outline: none;
                    opacity: 0.7;
                    transition: opacity .2s;
                }
                .rating-input:hover {
                    opacity: 1;
                }
                .rating-input::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    background: #eab308;
                    border-radius: 50%;
                    cursor: pointer;
                }
                .rating-input::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    background: #eab308;
                    border-radius: 50%;
                    cursor: pointer;
                }

                .modal-footer {
                    margin-top: 1.5rem; /* mt-6 */
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.75rem; /* space-x-3 */
                }

                .cancel-button {
                    background: none;
                    padding: 0.5rem 1rem;
                    border: 1px solid var(--gray-300);
                    border-radius: 0.5rem;
                    color: var(--gray-700);
                    transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.2s ease-in-out;
                    cursor: pointer;
                }

                .cancel-button:hover {
                    background-color: var(--gray-100);
                }

                html.dark .cancel-button {
                    border-color: var(--gray-600);
                    color: var(--gray-300);
                }
                html.dark .cancel-button:hover {
                    background-color: var(--gray-700);
                }

                .submit-button {
                    background-color: var(--primary-500);
                    color: var(--white);
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    transition: background-color 0.2s ease-in-out;
                    border: none;
                    cursor: pointer;
                }

                .submit-button:hover {
                    background-color: var(--primary-600);
                }
                /* Star rating styles from global style.css */
                .star-rating {
                    display: flex;
                    gap: 2px;
                }
                .star {
                    color: #eab308;
                    font-size: 1.2em; /* Adjust star size */
                }
            </style>
            <div class="modal-backdrop modal-animation">
                <div class="modal-content">
                    <div class="modal-padding">
                        <div class="modal-header">
                            <h3 class="modal-title">${modalTitle}</h3>
                            <button id="closeModal" class="close-button">
                                <span>&times;</span> <!-- Close icon -->
                            </button>
                        </div>
                        
                        <form id="movieForm">
                            <div class="form-section">
                                <div class="form-group">
                                    <label for="title" class="input-label">Title</label>
                                    <input type="text" id="title" name="title" value="${movie ? movie.title : ''}" required class="form-input">
                                </div>
                                
                                <div class="form-group">
                                    <label for="imageUrl" class="input-label">Image URL</label>
                                    <input type="url" id="imageUrl" name="imageUrl" value="${movie ? movie.imageUrl : ''}" required class="form-input">
                                </div>
                                
                                <div class="form-group">
                                    <label for="category" class="input-label">Category</label>
                                    <select id="category" name="category" required class="form-select">
                                        <option value="">Select a category</option>
                                        <option value="Action" ${movie && movie.category === 'Action' ? 'selected' : ''}>Action</option>
                                        <option value="Comedy" ${movie && movie.category === 'Comedy' ? 'selected' : ''}>Comedy</option>
                                        <option value="Drama" ${movie && movie.category === 'Drama' ? 'selected' : ''}>Drama</option>
                                        <option value="Horror" ${movie && movie.category === 'Horror' ? 'selected' : ''}>Horror</option>
                                        <option value="Sci-Fi" ${movie && movie.category === 'Sci-Fi' ? 'selected' : ''}>Sci-Fi</option>
                                        <option value="Thriller" ${movie && movie.category === 'Thriller' ? 'selected' : ''}>Thriller</option>
                                        <option value="Animation" ${movie && movie.category === 'Animation' ? 'selected' : ''}>Animation</option>
                                        <option value="Documentary" ${movie && movie.category === 'Documentary' ? 'selected' : ''}>Documentary</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="description" class="input-label">Description</label>
                                    <textarea id="description" name="description" rows="3" required class="form-textarea">${movie ? movie.description : ''}</textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label for="rating" id="ratingLabel" class="input-label">Rating (${currentRating})</label>
                                    <div class="rating-group">
                                        <input type="range" id="rating" name="rating" min="0" max="5" step="0.5" value="${currentRating}" class="rating-input">
                                        <div class="star-rating">
                                            ${this.renderStars(currentRating)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="modal-footer">
                                <button type="button" id="cancelBtn" class="cancel-button">
                                    Cancel
                                </button>
                                <button type="submit" class="submit-button">
                                    ${submitButtonText}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners AFTER the innerHTML is set
        this._addEventListeners();
    }

    renderStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars += '<span class="star">⭐</span>'; // Full star
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars += '<span class="star">🌟</span>'; // Half star
            } else {
                stars += '<span class="star">☆</span>'; // Empty star
            }
        }
        
        return stars;
    }
}

customElements.define('custom-movie-modal', CustomMovieModal);
