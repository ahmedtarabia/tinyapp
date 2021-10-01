

const findUserByEmail = function(email, users) {
  for (let userId in users) {
    const user = users[userId];
    if (email === user.email) {
      return user;
    }
  }
  return false;
};

function generateRandomString() {
  let word = Math.random().toString(16).substr(2, 6);
  return word;
}

const urlsForUser = function(id) {
  let myURLs = {};
  for ( let key in urlDatabase ) {
    if (urlDatabase[key].userID === id) {
      myURLs[key] = urlDatabase[key]
    }
  }
  return myURLs;
}

const authenticateUser = function(email, password, users) {
  const userFound = findUserByEmail(email, users);
  if(userFound && bcrypt.compareSync(password, userFound.password) ) {
    return userFound;
  }
  return false;
}

const createUser = function (email, password, users) {
  const hashedPassword = bcrypt.hashSync(password, salt)
  const userId = generateRandomString()
  users[userId] = { userId, email, password: hashedPassword }
  return userId;
}

module.exports =  findUserByEmail, generateRandomString, urlsForUser, authenticateUser, createUser 