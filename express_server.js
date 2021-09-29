const express = require("express");
const app = express();
const PORT = 8080;
// const uuid = require('uuidv4');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
// Static assets (images, css files) are being served from the public folder
app.use(express.static('public'));
app.set("view engine", "ejs");

function generateRandomString() {
  let word = Math.random().toString(16).substr(2, 6);
  return word;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "the32w": {
    id: "the32w", 
    email: "ahmedlighthouse@gmail.com", 
    password: "purple-monkey-dinosaur"
  },
 "5e34rt": {
    id: "5e34rt", 
    email: "tarabialhl@gmail.com", 
    password: "dishwasher-funk"
  }
}

const findUserByEmail = function(email, users) {
  for (let userId in users) {
    const user = users[userId];
    if (email === user.email) {
      return user;
    }
  }
  return false;
};

const createUser = function (email, password, users) {
  const userId = generateRandomString()
  users[userId] = { userId, email, password}
  // adding to an object
  // objectname[key] = value
  // Create a new user
  return userId;
}

const authenticateUser = function(email, password, users) {
  const userFound = findUserByEmail(email, users);
  if(userFound && userFound.password === password) {
    return userFound;
  }
  return false;
}

app.get("/urls/new", (req, res) => {
  const templateVars = {  
    email: req.cookies['email']
  };
  res.render("urls_new", templateVars);
});

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
  const email = users[req.cookies['user_id']] ? users[req.cookies['user_id']].email : null;
  const templateVars = { 
    urls: urlDatabase, 
    email: email
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    email: req.cookies['email']
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
    if ( !longURL ) {
      return res.status(404).send("Error: Long URL not found. ")
    }
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  const templateVars = {
    email: req.cookies['email'],
    password: req.cookies['password']
  };
  res.render("urls_login.ejs", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = {
    email: req.cookies['email'],
    password: req.cookies['password']
  };

  res.render("urls_register.ejs", templateVars);
});

app.post("/urls", (req, res) => {
  const templateVars = {
    shortURL: generateRandomString(),
    longURL: req.body.longURL
  };
  const shortURL =  templateVars.shortURL;
  urlDatabase[shortURL] =  templateVars.longURL;
  res.redirect("/urls/" + shortURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls/");
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  console.log(req.body.longURL)
  res.redirect("/urls/" + shortURL);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // if(!email || !password) return res.status(404).send('Invalid email or password')
  const user = authenticateUser(email, password, users);
  console.log('user from login', user)
  if (user) {
    res.cookie('user_id', user.userId);
    res.redirect("/urls");
    return;
  }
  res.status(403).send("Email cannot be found or wrong password/email")
});

app.post("/logout", (req, res) => {
  // res.clearCookie('email');
  res.clearCookie('user_id');
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  // const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send('You did not enter email and/or password')
  }
  const userFound = findUserByEmail(email, users)
  if (userFound) {
    return res.status(400).send('Sorry, you are already registered! Go back and login');
  }
  const userId = createUser(email, password, users);
  res.cookie('user_id', userId);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});