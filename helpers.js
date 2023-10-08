const generateRandomString = (length) => {
  return Math.random().toString(36).substring(2, 2 + length);
};

const getUserByEmail = (email, database) => {
  let user;

  for (const userId in database) {
    if (database[userId].email === email) { // Found existing user
      user = database[userId];
      break;
    }
  }

  return user; // undefined, if no email found
};

const authenticateUser = (id, database) => {
  let userID;

  for (const userId in database) {
    if (userId === id) {
      userID = database[id];
      break;
    }
  }

  return userID;
};

const urlsForUser = (id, urlDatabase) => {
  const filteredUrls = {};

  for (const [shortUrl, urlData] of Object.entries(urlDatabase)) {
    if (urlData.userID === id) {
      filteredUrls[shortUrl] = urlData;
    }
  }

  return filteredUrls;
};

const isValidURL = (url) => {
  return (url.includes("http://") || url.includes("https://"));
};

module.exports = { generateRandomString, getUserByEmail, authenticateUser, urlsForUser, isValidURL };