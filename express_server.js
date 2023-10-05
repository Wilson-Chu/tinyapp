const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080

const generateRandomString = function() {
  return Math.random().toString(36).substring(2, 8);
};

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];

  if (longURL) {
    res.redirect(longURL); // Redirect to the long URL if id-longURL pair exists in DB
  } else {
    res.status(404).send("URL not found");
  }
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;

  res.redirect(`/urls/${id}`);
  // res.send("Ok"); // Respond with 'Ok' (we will replace this)
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
  res.cookie('username', req.body.username);

  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});