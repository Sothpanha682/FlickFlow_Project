class CustomNavbar extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --primary-500: #6366f1; /* Define CSS variables */
                    --gray-800: #1f2937;
                    --gray-700: #374151;
                    --white: #ffffff;
                }

                nav {
                    background-color: rgba(31, 41, 55, 0.8); /* Slightly less translucent */
                    backdrop-filter: blur(15px); /* More blur for a stronger effect */
                    -webkit-backdrop-filter: blur(15px); /* For Safari support */
                    color: var(--white);
                    padding: 1rem;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); /* More prominent shadow */
                    border-bottom: 1px solid rgba(255, 255, 255, 0.2); /* Slightly more visible border */
                    position: sticky; /* Make it stick to the top */
                    top: 0;
                    z-index: 1000; /* Ensure it's above other content */
                }

                html.dark body nav { /* Dark mode for global body affects the navbar */
                    background-color: rgba(17, 24, 39, 0.8); /* Darker, slightly less translucent background for dark mode */
                }
                
                .container {
                    max-width: 1280px;
                    margin-left: auto;
                    margin-right: auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .nav-group {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem; /* space-x-2 */
                }

                .nav-title {
                    font-weight: 700; /* font-bold */
                    font-size: 1.25rem; /* text-xl */
                    text-shadow: 0 0 5px rgba(255, 255, 255, 0.5); /* Subtle text shadow */
                }

                .nav-links {
                    display: flex;
                    gap: 1.5rem; /* space-x-6 */
                }

                .nav-links a {
                    color: var(--white);
                    transition: color 0.2s ease-in-out;
                    text-decoration: none; /* remove underline */
                }

                .nav-links a:hover {
                    color: var(--primary-500);
                    text-shadow: 0 0 8px var(--primary-500); /* Glow effect on hover */
                }

                .user-actions {
                    display: flex;
                    align-items: center;
                    gap: 1rem; /* space-x-4 */
                }

                #themeToggle {
                    background: none;
                    border: none;
                    color: var(--white);
                    padding: 0.5rem;
                    border-radius: 9999px;
                    transition: background-color 0.2s ease-in-out;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                #themeToggle:hover {
                    background-color: var(--primary-500); /* Primary color on hover */
                    color: var(--white);
                    box-shadow: 0 0 10px var(--primary-500); /* Glow effect */
                }

                .user-avatar {
                    width: 2rem;
                    height: 2rem;
                    border-radius: 9999px;
                    background-color: var(--primary-500);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--white); /* For text icon */
                    font-size: 1rem; /* Adjust font size for text icon */
                }
                
                @media (max-width: 640px) {
                    .nav-links {
                        display: none;
                    }
                }
            </style>
            <nav>
                <div class="container">
                    <div class="nav-group">
                        <span class="nav-icon">&#127916;</span> <!-- Film icon -->
                        <span class="nav-title">FlickFlow</span>
                    </div>
                    <div class="nav-links">
                        <a href="index.html">Home</a>
                        <a href="dashboard.html">Dashboard</a>
                    </div>
                    <div class="user-actions">
                        <button id="themeToggle">
                            <span class="toggle-icon">🌙</span> <!-- Moon icon -->
                        </button>
                        <div class="user-avatar">
                            <span>👤</span> <!-- User icon -->
                        </div>
                    </div>
                </div>
            </nav>
        `;
        
        // Theme toggle functionality
        const themeToggle = this.shadowRoot.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const iconSpan = themeToggle.querySelector('.toggle-icon');
            if (document.documentElement.classList.contains('dark')) {
                iconSpan.textContent = '🌙'; // Moon icon for dark mode
            } else {
                iconSpan.textContent = '☀️'; // Sun icon for light mode
            }
        });
    }
}

customElements.define('custom-navbar', CustomNavbar);
