# GPA Calculator
## Introduction
Caculate my GPA and credits using HTML, JavaScript, Node.js, and MySQL.
## History
The app is originally deployed on Heroku. However, Heroku announced the removal of their free product plans on August 2022.


## How to use it
1. Create a database. (I used MySQL workbench).
2. Modify the code in index.js
```
// Modify this for your MySQL database
var db_config = {
    host: '<your host>',
    user: '<your user>',
    password: '<your password>',
    database: '<your database>'
};
//
```


3. `node index.js` to start the server
4. The website is at http://localhost:4000
5. Register. Login. Then you can use the GPA Calculator!