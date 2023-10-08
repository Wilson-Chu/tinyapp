const express = require("express");
const { generateRandomString, authenticateUser, getUserByEmail, urlsForUser } = require("./helpers");

const morgan = require("morgan");
const cookieSession = require('cookie-session');
const app = express();

const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // (req, res, next) => {}
app.use(cookieSession({
  name: 'session',
  keys: [generateRandomString(12)],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userId: "user1RandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userId: "user2RandomID"
  }
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  }
  res.redirect("/login");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlsForUser(req.session.user_id, urlDatabase),
    user: authenticateUser(req.session.userId, users),
  };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: authenticateUser(req.session.user_id, users),
  };

  // If not logged in
  if (Object.keys(req.session).length === 0) {
    res.redirect("/login");
  }

  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const userLinks = urlsForUser(req.session.user_id, urlDatabase);
  const idArr = Object.keys(userLinks);

  for (let linkId of idArr) {
    if (req.params.id === linkId) {
      const templateVars = {
        id: req.params.id,
        longURL: urlDatabase[req.params.id].longURL,
        user: authenticateUser(req.session.user_id, users),
      };

      res.render("urls_show", templateVars);
    }
  }

  const templateVars = {
    id: req.params.id,
    user: authenticateUser(req.session.user_id, users),
  };

  res.status(403).send("URL not found");

  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;

  for (const linkId in urlDatabase) {
    if (id === linkId) {
      const longURL = urlDatabase[id];
      res.redirect(longURL); // Redirect to the long URL if id-longURL pair exists in DB
    }
  }

  res.status(404).send("URL not found");
});

app.get("/register", (req, res) => {
  // const templateVars = { email: req.body.email, password: req.body.password };

  // res.render("register", templateVars);

  const templateVars = { user: authenticateUser(req.session.user_id, users) };

  if (Object.keys(req.session).length !== 0) {
    res.redirect("/urls");
  }

  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = { email: req.body.email, password: req.body.password };

  res.render("login", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console (temp. testing...)
  const id = generateRandomString(6);
  urlDatabase[id] = req.body.longURL;

  res.redirect(`/urls/${id}`);
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const newLongURL = req.body.editURL; // From urls_show.ejs

  // Update the long URL in the urlDatabase
  urlDatabase[id] = newLongURL;

  res.redirect(`/urls`);
});

app.post('/urls/:id/delete', (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];

  res.redirect('/urls');
});

app.post('/login', (req, res) => {

  const { email, password } = req.body;

  const user = authenticateUser(users, email, password);

  if (user) {
    res.session("user_id", user.id);
    res.redirect('/urls');
  } else {
    res.status(401).send('Authentication failed');
  }
});

app.post('/logout', (req, res) => {
  res.clearsession('user_id');

  res.redirect('/login');
});

// I can definitely refactor to use helper functions, later...
app.post('/register', (req, res) => {
  const id = generateRandomString(6);
  const newUser = { id, ...req.body };

  if (!req.body.email || !req.body.password) {
    return res.status(400).send('Invalid information - please provide email or password');
  }

  for (const userId in users) {
    if (users[userId].email === req.body.email) {
      return res.status(400).send('User with this email already exists');
    }
  }

  users[id] = newUser;
  res.session("user_id", id);

  console.log("NEW USER CREATED", users);

  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});