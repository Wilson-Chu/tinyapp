const generateRandomString = function(length) {
  return Math.random().toString(36).substring(2, 2 + length);
};

const getUserByEmail = (email, database) => {
  let user;

  for (const userId in database) {
    if (database[userId].email === email) {
      user = database[userId];
      break;
    }
  }
  return user;
};

const authenticateUser = (id, database) => {
  let userID;

  for (const userId in database) {
    if (userId === id) {
      userID = database[id];
    }
  }

  return userID;
};

const urlsForUser = (id, urlDatabase) => {
  const urlArr = Object.keys(urlDatabase);
  const filteredUrls = {};

  for (const shortUrl of urlArr) {
    if (urlDatabase[shortUrl].userID === id) {
      filteredUrls[shortUrl] = urlDatabase[shortUrl];
    }
  }

  return filteredUrls;
};

module.exports = { generateRandomString, getUserByEmail, authenticateUser, urlsForUser };