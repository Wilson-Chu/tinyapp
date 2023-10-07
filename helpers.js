const generateRandomString = function(length) {
  return Math.random().toString(36).substring(2, 2 + length);
};

const getUserByEmail = (email, database) => {
  const user = database[database.id][email];

  return user;
};

const authenticateUser = (users, email, password) => {
  const user = users[email];

  if (!user || user.password !== password) {
    return false;
  }

  return true;
};

const createUser = (users, newUserInfo) => {
  if (users[newUserInfo.email]) {
    return { error: "User already exists", user: null };
  }

  const newId = Object.values(users).length + 1;

  // const newUser = {id:newId}
  // newUser.name = newUserInfo.name
  // newUser.email = newUserInfo.email
  // newUser.password = newUserInfo.password
  // newUser.imagePath = newUserInfo.imagePath

  const newUser = { id: newId, ...newUserInfo };

  users[newUser.email] = newUser;

  return { error: null, user: newUser };
};

module.exports = { generateRandomString, getUserByEmail, authenticateUser, createUser };