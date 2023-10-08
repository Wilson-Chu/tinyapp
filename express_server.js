const express = require("express");
const { generateRandomString, authenticateUser, getUserByEmail, urlsForUser } = require("./helpers");

const cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs");
const app = express();

const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
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
    return res.redirect("/urls");
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

  if (!req.session.user_id) { // Check if user is not logged in
    return res.redirect("/login");
  }

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: authenticateUser(req.session.user_id, users),
  };

  // If not logged in
  // if (Object.keys(req.session).length === 0) {
  //   return res.redirect("/login");
  // }

  if (!req.session.user_id) { // Check if user is not logged in
    return res.redirect("/login");
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

      return res.render("urls_show", templateVars);
    }
  }

  const templateVars = {
    id: req.params.id,
    user: authenticateUser(req.session.user_id, users),
  };

  res.status(403).send("URL not found.");

  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;

  for (const linkId in urlDatabase) {
    if (id === linkId) {
      const longURL = urlDatabase[id];
      return res.redirect(longURL); // Redirect to the long URL if id-longURL pair exists in DB
    }
  }

  res.status(404).send("URL not found.");
});

app.get("/register", (req, res) => {
  const templateVars = { user: authenticateUser(req.session.user_id, users) };

  if (Object.keys(req.session).length !== 0) {
    return res.redirect("/urls");
  }

  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = { user: authenticateUser(req.session.user_id, users) };

  if (Object.keys(req.session).length !== 0) {
    return res.redirect("/urls");
  }

  res.render("login", templateVars);
});

app.post("/urls", (req, res) => {
  const id = generateRandomString(6);
  const longURL = req.body.longURL;

  if (Object.keys(req.session).length === 0) {
    return res.redirect("/login");
  }

  urlDatabase[id] = {
    longURL: longURL,
    userID: req.session.user_id,
  };

  res.redirect(`/urls/${id}`);
});

app.post("/urls/:id", (req, res) => {
  if (Object.keys(req.session).length === 0) {
    return res.status(403).send("Login to edit the URL.");
  }

  const id = req.params.id;
  const userLinks = urlsForUser(req.session.user_id, urlDatabase);

  if (userLinks[id].userID === req.session.user_id) {
    const newLongURL = req.body.editURL; // From urls_show.ejs

    // Update the long URL in the urlDatabase
    urlDatabase[id].longURL = newLongURL;

    return res.redirect("/urls");
  }

  res.status(403).send("Invalid account. Please login to edit the URL.");
});

app.post('/urls/:id/delete', (req, res) => {
  const id = req.params.id;

  if (Object.keys(req.session).length === 0) {
    return res.status(403).send(`Login to delete the URL.`);
  }

  const userLinks = urlsForUser(req.session.user_id, urlDatabase);

  if (userLinks[id].userID === req.session.user_id) {
    delete urlDatabase[id];
    return res.redirect("/urls");
  }

  res.status(403).send("Invalid account. Please login to edit the URL.");
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email, users);

  if (user) {
    if (bcrypt.compareSync(password, user.password)) {
      req.session.user_id = user.id;
      return res.redirect("/urls");
    }
  }

  res.status(401).send("Authentication failed. Invalid Email/Password.");
});

app.post('/logout', (req, res) => {
  delete req.session.user_id;

  res.redirect('/login');
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Invalid information - please provide email or password');
  }

  // if (getUserByEmail(email, users)) {
  //   users[randomUserId] = {
  //     id: randomUserId,
  //     email: email,
  //     password: bcrypt.hashSync(password, 10),
  //   };

  //   req.session.user_id = randomUserId;
  // } else {
  //   return res.status(400).send("Email already taken. Please try another one.");
  // }

  if (getUserByEmail(email, users)) {
    return res.status(400).send("Email already taken. Please try another one.");
  }

  const randomUserId = generateRandomString(6);
  users[randomUserId] = {
    id: randomUserId,
    email: email,
    password: bcrypt.hashSync(password, 10),
  };

  req.session.user_id = randomUserId;

  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});