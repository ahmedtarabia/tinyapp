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
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "the32w"
  }, 
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "the32w"
  } 
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
  return userId;
}

const authenticateUser = function(email, password, users) {
  const userFound = findUserByEmail(email, users);
  if(userFound && userFound.password === password) {
    return userFound;
  }
  return false;
}

const urlsForUser = function(id) {
  let myURLs = {};
  console.log("in the fuction",id, urlDatabase)
  for ( let key in urlDatabase ) {
    console.log(urlDatabase[key].userID)
    if (urlDatabase[key].userID === id) {
      myURLs[key] = urlDatabase[key]
    }
  }
  return myURLs;
}
// console.log("urlforuser--->",urlsForUser("the32w"))

app.get("/urls/new", (req, res) => {
  const templateVars = {  
    email: req.cookies['email'],
    user: users[req.cookies['user_id']]
  };
  if ( !req.cookies['user_id'] ) {
    res.redirect("/login");
    return;
  }
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
  const user = users[req.cookies['user_id']]
  const urls = urlsForUser(req.cookies['user_id'])
  console.log("urls----> ",urls)
  const templateVars = { 
    urls: urls,
    user: user
  };
  console.log("urls4user/urls----->",urlsForUser(req.cookies['user_id']))
  if ( !req.cookies['user_id'] ) {
    res.status(403).send("You should login / register first.");
    return;
  }
  // console.log("/urls tempVARS--->", templateVars)
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.cookies['user_id']]
  };
  // console.log(templateVars)
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;

  if ( !urlDatabase[shortURL] ) {
    return res.status(403).send("Invalid shortURL!")
  }
  const longURL = urlDatabase[shortURL].longURL;
 
    if ( !longURL ) {
      return res.status(404).send("Error: Long URL not found. ")
    }
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies['user_id']]
  };
  if ( req.cookies['user_id'] ) {
    res.redirect("/urls");
    return;
  }
  res.render("urls_login.ejs", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = {
    email: req.cookies['email'],
    password: req.cookies['password'],
    user: null
  };
  if ( req.cookies['user_id'] ) {
    res.redirect("/urls");
    return;
  }
  res.render("urls_register.ejs", templateVars);
});

app.post("/urls", (req, res) => {
  const templateVars = {
    shortURL: generateRandomString(),
    longURL: req.body.longURL
  };
  const shortURL =  templateVars.shortURL;
  console.log("/urls shortURL ---->", shortURL, req.cookies['user_id'])
  urlDatabase[shortURL] =  {longURL: req.body.longURL, userID: req.cookies['user_id']};
  res.redirect("/urls/" + shortURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  console.log("urlDatabase--->",urlDatabase)
  console.log("ShortURL--->",shortURL)
  console.log("req.cookies--->",req.cookies['user_id'])
  if ( req.cookies['user_id'] === urlDatabase[shortURL].userID ) {
    delete urlDatabase[shortURL];
    res.redirect("/urls/");
    return;
  } else {
    res.status(403).send("Not allowed to delete this URL");
    return;
  }
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  console.log("urlDatabase--->",urlDatabase)
  console.log("ShortURL--->",shortURL)
  console.log("req.cookies--->",req.cookies['user_id'])
  if (req.cookies['user_id'] === urlDatabase[shortURL].userID) {
    urlDatabase[shortURL] = {longURL: req.body.longURL, userID: req.cookies['user_id']};
    res.redirect("/urls/" + shortURL);
    return;
  } else {
    res.status(403).send("Not allowed to edit this URL");
    return;
  }
  
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // if(!email || !password) return res.status(404).send('Invalid email or password')
  const user = authenticateUser(email, password, users);
  // console.log('user from login', user)
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
  res.redirect("/register");
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