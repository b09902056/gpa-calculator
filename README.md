# GPA Calculator
## Introduction

## History
The app is originally deployed on Heroku. On August 2022, Heroku announced the removal of their free product plans.
Therefore I cannot use it anymore. Now users have to create database by themselves, and use their computer as the server. 

## How to use it
1. Create a database. (I used MySQL workbench).
2. Modify the code in index.js
```
let db = mysql.createConnection({
  host: '{your host}',
  user: '{your user}',
  password: '{your password}}',
  database: '{your database}'
})
```
3. Create a table called 'account' with the following columns. (I used MySQL workbench).
![](https://i.imgur.com/DcUbvJa.png)
4. Under the directory 'GPA-Calculator', there are 'static', 'index.js', and 'package.json' initially.
5. 
```
npm install express
npm install cors
npm install dotenv
npm install bcrypt
```

6. `node index.js` to start the server
7. The website is at http://localhost:4000
8. Register. Login. Then you can use the GPA Calculator!



上傳github
放上圖片（溢出）
code調整成圖片中的演算法

上傳github anime recommendation