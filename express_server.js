const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

function generateRandomString() {
  let word = Math.random().toString(16).substr(2, 6);
  return word;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls/new", (req, res) => {
  const templateVars = {  
    username: req.cookies['username']
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
  const templateVars = { 
    urls: urlDatabase, 
    username: req.cookies['username']
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies['username'] };
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

app.post("/urls", (req, res) => {
  const templateVars = { shortURL: generateRandomString(), longURL: req.body.longURL };
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
  res.cookie('username', req.body.username)
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie('username')
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});