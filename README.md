# FlickFlow - Movie Universe Manager

FlickFlow is a dynamic web application designed to manage and display a collection of movies. It features a user-friendly interface for browsing movie details, a compelling slideshow of top-rated films, and a secure dashboard for administrators to add, edit, and delete movie entries. The application leverages modern web components and client-side storage to provide a seamless and responsive experience.

## Features

- **Movie Listing**: Browse through a comprehensive list of movies with details like title, image, description, rating, and category.
- **Top-Rated Slideshow**: A captivating full-width slideshow showcasing the top 5 highest-rated movies with automatic cycling and manual navigation controls.
- **Movie Details**: Each movie card provides a brief overview and can be interacted with for administrative actions on the dashboard.
- **Admin Dashboard**:
    - **Secure Login**: Access the dashboard through a simple username/password authentication (default: `admin` / `admin123`).
    - **Add Movies**: Easily add new movie entries to the collection.
    - **Edit Movies**: Modify existing movie details.
    - **Delete Movies**: Remove movies from the collection with a confirmation step.
- **Responsive Design**: Optimized for various screen sizes, from mobile devices to large desktops.
- **Dark Mode Toggle**: A convenient switch in the navigation bar to toggle between light and dark themes.
- **Client-Side Data Storage**: Movies are loaded from a `movies.json` file and managed persistently using `localStorage`.
- **Custom Web Components**: Utilizes `<custom-navbar>`, `<custom-movie-card>`, and `<custom-movie-modal>` for modular and reusable UI elements.

## Technologies Used

- **HTML5**: For structuring the web content.
- **CSS3**: For styling, including responsive design and dark mode.
- **JavaScript ES6+**: For all interactive functionalities, custom web components, and data management.
- **Web Components**: Shadow DOM and custom elements for encapsulated and reusable UI.

## Setup and Installation

To get FlickFlow up and running on your local machine, follow these simple steps:

1.  **Clone the repository** (if applicable, or download the project files):
    ```bash
    git clone [repository-url]
    cd movie-universe-manager
    ```
    *(Note: Assuming this project is downloaded directly, you would skip the `git clone` step and just navigate to the project directory.)*

2.  **Open with a Live Server**:
    This project does not require a backend server or complex build tools. You can run it directly by opening `index.html` or `login.html` in a web browser. For development, it is recommended to use a live server extension (e.g., "Live Server" for VS Code) to handle file serving and auto-reloading.

    -   **VS Code Live Server**:
        1.  Install the "Live Server" extension by Ritwick Dey from the VS Code Marketplace.
        2.  Right-click on `index.html` or `login.html` in the file explorer.
        3.  Select "Open with Live Server".

## Usage

### Public View (`index.html`)

Navigate to `index.html` to see the main movie listing and the top-rated movie slideshow. You can toggle between light and dark modes using the switch in the navbar.

### Admin Dashboard (`dashboard.html`)

1.  **Login**: Access `login.html`.
    -   **Default Admin Credentials**:
        -   Username: `admin`
        -   Password: `admin123`
    -   Enter the credentials and click "Login". Upon successful login, you will be redirected to `dashboard.html`.

2.  **Manage Movies**:
    -   On the dashboard, you will see all movies listed.
    -   **Add New Movie**: Click the "Add Movie" button to open a modal form. Fill in the details (Title, Image URL, Category, Description, Rating) and click "Add Movie".
    -   **Edit Movie**: Click the "Edit" button on any movie card to open the modal pre-filled with the movie's current details. Make your changes and click "Save Changes".
    -   **Delete Movie**: Click the "Delete" button on any movie card. A confirmation dialog will appear. Confirm to remove the movie.

All changes made in the dashboard are stored in your browser's `localStorage`, ensuring data persistence across sessions.

## Project Structure

```
.
├── components/
│   ├── movie-card.js      # Custom element for displaying a single movie card.
│   ├── movie-modal.js     # Custom element for the add/edit movie modal.
│   └── navbar.js          # Custom element for the navigation bar with theme toggle.
├── dashboard.html         # Admin dashboard page for movie management.
├── index-script.js        # JavaScript logic for the main movie display page.
├── index.html             # Main application page with movie listings and slideshow.
├── login-script.js        # JavaScript logic for handling user login.
├── login.html             # Login page for accessing the dashboard.
├── movies.json            # Initial movie data in JSON format.
├── script.js              # JavaScript logic for the admin dashboard.
└── style.css              # Global styles for the application, including light/dark themes.
```

## Contributing

Contributions are welcome! If you have suggestions or improvements, please feel free to:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## Author

Soth Panha

## License

This project is open-source and available under the MIT License.
