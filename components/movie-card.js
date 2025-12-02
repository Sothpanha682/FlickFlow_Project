class CustomMovieCard extends HTMLElement {
    connectedCallback() {
        const movieId = this.getAttribute('movie-id');
        const title = this.getAttribute('title');
        const imageUrl = this.getAttribute('image-url');
        const description = this.getAttribute('description');
        const rating = this.getAttribute('rating');
        const category = this.getAttribute('category');
        const isDashboard = this.getAttribute('is-dashboard') === 'true';
        console.log(`Movie Card: ${title}, isDashboard: ${isDashboard}, raw attribute: ${this.getAttribute('is-dashboard')}`);

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                ${isDashboard ? '' : '.action-buttons { display: none; }'}
                :host {
                    --primary-500: #6366f1;
                    --primary-600: #4f46e5;
                    --secondary-500: #ec4899;
                    --white: #ffffff;
                    --gray-100: #f3f4f6; /* For dark mode text */
                    --gray-300: #d1d5db; /* For dark mode description text */
                    --gray-600: #4b5563; /* For light mode description text */
                    --gray-800: #1f2937; /* For dark mode card background */
                    --gray-900: #111827; /* For light mode title text */
                    --card-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    --card-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }

                .action-buttons {
                    display: flex;
                    gap: 0.1rem; /* Space between buttons */
                }

                .edit-button, .delete-button {
                    courser: pointer;
                    background: none;
                    border: none;
                    transition: color 0.2s ease-in-out;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem; /* gap-1 */
                    cursor: pointer;
                    font-size: 0.9rem; /* Adjust font size for button text */
                }

                .edit-button {
                    color: var(--primary-500);
                }

                .edit-button:hover {
                    color: var(--primary-600);
                }

                .delete-button {
                    color: #ef4444; /* A red color for delete */
                }

                .delete-button:hover {
                    color: #dc2626; /* A darker red on hover */
                }

                .card {
                    background-color: rgba(255, 255, 255, 0.1); /* Slightly transparent background */
                    backdrop-filter: blur(10px); /* Frosted glass effect */
                    border: 1px solid rgba(255, 255, 255, 0.2); /* Subtle light border */
                    border-radius: 0.75rem; /* rounded-xl */
                    overflow: hidden;
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37); /* Deeper, more spread out shadow */
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* More dynamic transition */
                    width: 100%;
                    height: 100%;
                    position: relative; /* Allow absolute positioning of children */
                    display: flex; /* Make it a flex container */
                    flex-direction: column; /* Stack children vertically */
                    justify-content: flex-end; /* Push content to the bottom */
                }
                
                html.dark .card {
                    background-color: rgba(31, 41, 55, 0.6); /* Darker transparent background for dark mode */
                    border: 1px solid rgba(255, 255, 255, 0.15);
                }

                .card:hover {
                    transform: translateY(-8px) scale(1.02); /* More pronounced lift and slight scale on hover */
                    box-shadow: 0 18px 70px 0 rgba(0, 0, 0, 0.5); /* Enhanced shadow on hover */
                    border: 1px solid var(--primary-500); /* Highlight border on hover */
                }
                
                .card-image {
                    position: absolute; /* Position image absolutely to cover the card */
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    z-index: 0; /* Ensure image is behind content */
                    filter: brightness(0.6) grayscale(0.2); /* Dimmer and slightly desaturated image */
                    transition: filter 0.4s ease;
                }

                .card:hover .card-image {
                    filter: brightness(0.8) grayscale(0); /* Less dim and full color on hover */
                }
                
                .card-content {
                    position: relative; /* Make content relative to .card for z-index */
                    z-index: 1; /* Ensure content is above the image */
                    padding: 12rem 1.5rem 1.5rem; /* More padding for banner content */
                    background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 100%); /* Even darker gradient for readability */
                    color: var(--white); /* White text for contrast */
                    transition: background 0.4s ease;
                }

                .card:hover .card-content {
                    background: linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.1) 100%);
                }

                .card-header {
                    display: flex;
                    flex-direction: column; /* Stack title and badge vertically */
                    align-items: flex-start; /* Align text to the left */
                    margin-bottom: 0.75rem; /* mb-3 */
                }

                .card-title {
                    font-size: 1.5rem; /* Larger title for banner */
                    font-weight: 700; /* Bolder title */
                    color: var(--white); /* White title for contrast */
                    margin: 0;
                    text-shadow: 0 0 10px rgba(99, 102, 241, 0.7), 0 0 20px rgba(99, 102, 241, 0.5); /* Neon glow effect */
                }
                
                .category-badge {
                    background-color: var(--primary-500); /* Use primary color for badge */
                    color: var(--white);
                    padding: 0.4rem 0.8rem;
                    border-radius: 9999px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    margin-top: 0.5rem; /* Space below title */
                    box-shadow: 0 0 8px rgba(99, 102, 241, 0.6); /* Subtle glow for badge */
                }

                .description {
                    display: -webkit-box;
                    -webkit-line-clamp: 3; /* Allow more lines for description */
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    color: var(--gray-100); /* Lighter gray for description */
                    margin-bottom: 1.5rem; /* More space below description */
                    text-shadow: 0 0 5px rgba(255, 255, 255, 0.4); /* Subtle glow for description */
                }

                .card-footer {
                    display: flex;
                    justify-content: flex-start; /* Align content to the left */
                    align-items: center;
                    gap: 1rem; /* Space between rating and buttons */
                    margin-top: 1rem;
                }

                /* Star rating styles, already defined in global style.css.
                   Assuming custom elements inherit parent styles or handle their own star rendering. */
                .star-rating {
                    display: flex;
                  
                }
                .star {
                    color: #eab308;
                    font-size: 1.2em; /* Adjust star size */
                }
            </style>
            <div class="card">
                <img src="${imageUrl}" alt="${title}" class="card-image">
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="card-title">${title}</h3>
                        <span class="category-badge">${category}</span>
                    </div>
                    <p class="description">${description}</p>
                    <div class="card-footer">
                        <div class="star-rating">
                            ${this.renderStars(rating)}
                        </div>
                        ${isDashboard ? `
                            <div class="action-buttons">
                                <button class="edit-button">
                                    <span>✏️</span> <!-- Edit icon -->
                                    Edit
                                </button>
                                <button class="delete-button">
                                    <span>🗑️</span> <!-- Delete icon -->
                                    Delete
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        // Add event listener for the edit button
        if (isDashboard) {
            const editButton = this.shadowRoot.querySelector('.edit-button');
            editButton.addEventListener('click', () => {
                const movieData = {
                    id: parseInt(movieId, 10), // Ensure ID is a number
                    title: title,
                    imageUrl: imageUrl,
                    description: description,
                    rating: parseFloat(rating),
                    category: category
                };
                this.dispatchEvent(new CustomEvent('editMovie', {
                    bubbles: true, // Allow the event to bubble up the DOM tree
                    composed: true, // Allow the event to pass through shadow DOM boundaries
                    detail: movieData
                }));
            });

            // Add event listener for the delete button
            const deleteButton = this.shadowRoot.querySelector('.delete-button');
            deleteButton.addEventListener('click', () => {
                console.log('Dispatching deleteMovie event for ID:', movieId);
                this.dispatchEvent(new CustomEvent('deleteMovie', {
                    bubbles: true,
                    composed: true,
                    detail: { movieId: movieId }
                }));
            });
        }
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
            // The global style for .star will apply
        }
        
        return stars;
    }
}

customElements.define('custom-movie-card', CustomMovieCard);
