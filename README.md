# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

If you are a new user, you can register by entering your details in the registration page below. 

!["screenshot of Registration"](https://github.com/ahmedtarabia/tinyapp/blob/master/docs/register.png?raw=true)

You can login into your account after your first registration in the login page below.

!["screenshot of Login"](https://github.com/ahmedtarabia/tinyapp/blob/master/docs/login.png?raw=true)

The main page below will be the first page that you will see when you sign in. In this page you can edit / delete the current URL entries by clicking on the edit / delete button. You can also create a new URL by clicking on the create New URL in the navigation bar. 

!["screenshot of mainpage"](https://github.com/ahmedtarabia/tinyapp/blob/master/docs/mainPage.png?raw=true)

If you clicked on the create New URL, you be will see the page below. You can enter the website URL to generate a new short URL that can redirect you to the actual website. 

!["screenshot of Creating URL page"](https://github.com/ahmedtarabia/tinyapp/blob/master/docs/createURL.png?raw=true)

If you clicked the edit button on the main page, you will see the page below where you can edit your longURL without changing the shortURL. 

!["screenshot of Edit page"](https://github.com/ahmedtarabia/tinyapp/blob/master/docs/editPage.png?raw=true)

Finally, you can log out whenever you are done using the app! 

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.