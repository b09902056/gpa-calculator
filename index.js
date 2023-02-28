import express, { response } from 'express'
import path, { resolve } from 'path'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import mysql from 'mysql'
import bcrypt from 'bcrypt'

// import passport from 'passport'
// import {initialize} from './passport-config.js'
// import flash from 'express-flash'
// import session from 'express-session'
// import storage from 'node-sessionstorage'
// import apiRoute from './router.js'

// Modify this for your MySQL database
var db_config = {
    host: '<your host>',
    user: '<your user>',
    password: '<your password>',
    database: '<your database>'
};
//

let  db;
function handleDisconnect() {
  db = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  db.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  db.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}
handleDisconnect();

// let db = mysql.createConnection({
//  
// })
// db.connect((err) => {
//   if (err){
//     throw err;
//   }
//   console.log('db connected...')
// })


dotenv.config()
const app = express()
const port = process.env.PORT || 4000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const router = express.Router()


app.use(cors())
app.use(express.json())
app.use(router)
app.use(express.urlencoded({extended: false}))

// app.use('/api', apiRoute)

app.use(express.static(path.join(__dirname, 'static')))
console.log(__dirname)


db.query("CREATE TABLE IF NOT EXISTS account(\
  id INT NOT NULL AUTO_INCREMENT,\
  name VARCHAR(255) NOT NULL,\
  password VARCHAR(255) NOT NULL,\
  PRIMARY KEY (id))", 
  function (err, result) {
    if (err) throw err;
    // console.log(result);
});




app.get('/api/getcredit/:name', (req, res) => {
  let sql = `SELECT * FROM ${req.params.name}Credit WHERE id = 1`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result)
  })
})
app.post('/api/updatecredit/:name', (req, res) => {
  const c1 = req.body.type1, c2 = req.body.type2, c3 = req.body.type3, c4 = req.body.type4;
  let sql = `UPDATE ${req.params.name}Credit SET type1 = '${c1}', type2 = '${c2}',type3 = '${c3}', type4 = '${c4}' WHERE id = 1`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  })
})
app.post('/api/updatecourse/:name', (req, res) => {
  const name = req.params.name, sem = req.body.sem;
  let sql = `SELECT * FROM ${name}sem${sem} WHERE id = ${req.body.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    const id = req.body.id, title = req.body.title, type = req.body.type,
          credit = req.body.credit, grade = req.body.grade;
    if (result.length === 0){
      const data = {"id": id, "title": title, "type": type, "credit": credit,
                    "grade": grade};
      let sql = `INSERT INTO ${name}sem${sem} SET ?`;
      let query = db.query(sql, data, (err, result) => {
        if (err) throw err;
        res.send(result)
      })
    }
    else{
      let sql = `UPDATE ${name}sem${sem} SET id = '${id}', title = '${title}',
      type = '${type}', credit = '${credit}', grade = '${grade}' WHERE id = ${id}`;
      let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result)
      })
    }
  })
})
app.post('/api/deletecourse/:name', (req, res) => {
  const name = req.params.name, sem = req.body.sem, id=  req.body.id;
  let sql = `SELECT * FROM ${name}sem${sem} WHERE id = ${id}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length === 0){
      res.send(`no data with id ${id}`)
    }
    else{
      let sql = `DELETE FROM ${name}sem${sem} WHERE id = ${id}`;
      let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result)
      })
    }
  })
})
app.get('/api/initcourse/:semester', (req, res) => {
  let sql = `SELECT * FROM ${req.params.semester}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  })
})


//-------------------------------------------------------

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('./static'))
//   // console.log('[STATIC] GET STATIC FILES')
//   // console.log(path.join(__dirname, 'static', 'index.html'))
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'static', 'index.html'))
//     console.log('index.html ACCESSED')
//   })
// }
//-------------------------------------------------------
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'login.html'))
  console.log('login.html ACCESSED')
})
app.post('/api/login', async (req, res) => {
  let sql = `SELECT * FROM account WHERE name = '${req.body.name}'`;
  let query = db.query(sql, async (err, result) => {
    if (err) throw err;
    if (result.length == 0){
        console.log('account incorrect')
        res.status(200)
        res.send();
    }
    else{
      if (await bcrypt.compare(req.body.password, result[0].password)){
        res.status(201);
        res.send();
      }
      else {
        console.log('password incorrect')
        res.status(202);
        res.send();
      }
    }
  })
})
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'register.html'))
  console.log('register.html ACCESSED')
})

app.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const name = req.body.name
    
    let sql0 = `SELECT * FROM account WHERE name = '${name}'`;
    let query0 = db.query(sql0, (err, result) => {
      if (err) throw err;
      if (result.length > 0){
        res.status(201)
        res.send()
      }
      else{
        const data = {"name": name, "password": hashedPassword};
        let sql = 'INSERT INTO account SET ?';
        let query = db.query(sql, data, (err, result) => {
          if (err) throw err;
          console.log(result);
        })

        let sql2 = `CREATE TABLE ${name}Credit(\
          id INT NOT NULL,\
          type0 INT NULL DEFAULT 0,\
          type1 INT NULL DEFAULT 0,\
          type2 INT NULL DEFAULT 0,\
          type3 INT NULL DEFAULT 0,\
          type4 INT NULL DEFAULT 0,\
          PRIMARY KEY (id))`;
        db.query(sql2, (err, result) => {
          if (err) throw err;
          console.log(`${name}Credit table created...`)
        })
        for(let i = 1; i <= 9; i++){
          let sql3 = `CREATE TABLE ${name+'sem'+i}(\
          id INT NOT NULL,\
          title VARCHAR(255) NOT NULL,\
          type INT NOT NULL DEFAULT 0,\
          credit INT NOT NULL DEFAULT 0,\
          grade VARCHAR(255) NOT NULL,\
          PRIMARY KEY (id))`;
          db.query(sql3, (err, result) => {
            if (err) throw err;
            console.log(`${name+'sem'+i} table created...`)
          })
        }
        const data3 = {"id": 1, "type1": 0, "type2": 0, "type3": 0, "type4": 0};
        let sql3 = `INSERT INTO ${name}Credit SET ?`;
        let query3 = db.query(sql3, data3, (err, result) => {
          if (err) throw err;
        })
        res.send()
      }
    })
})




app.listen(port, () => {
  console.log('[SERVER] Server Listening on PORT:', port)
})

