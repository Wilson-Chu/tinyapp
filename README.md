# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["screenshot of URLs page"](https://github.com/Wilson-Chu/tinyapp/blob/main/docs/urls-page.png?raw=true)

!["screenshot of Login page"](https://github.com/Wilson-Chu/tinyapp/blob/main/docs/login-page.png?raw=true)

!["screenshot of Register page"](https://github.com/Wilson-Chu/tinyapp/blob/main/docs/register-page.png?raw=true)

!["screenshot of Create New URL page"](https://github.com/Wilson-Chu/tinyapp/blob/main/docs/create-new-url-page.png?raw=true)

!["screenshot of Edit URL page"](https://github.com/Wilson-Chu/tinyapp/blob/main/docs/edit-urls-page.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session
- nodemon
- Bootstrap

## Getting Started

- Clone the project to your local system by running `git clone git@github.com:Wilson-Chu/tinyapp.git` (for SSH users).
- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command
  - (OR use `npm start` if you like `nodemon`).

## Future Improvements

- The Logout button and user email display do not line up horizontally with the left-most elements. Will need to fix the CSS at some time.
- Also, when logged in, the header margins at top and bottom increase unexpectedly. Will need to fix CSS.
- Predefined urlDatabase information does not load upon registration.
- Error messages are extremely basic. Can update with better UX/UI considerations.