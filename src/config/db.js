const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'huysql2004', 
    database: 'db1' 
  });

connection.connect((err) => {
  if (err) {
    console.error('MySQL connect error', err);
    return;
  }
  console.log('MySQL connect success!');
  
  const creatTable = `
  CREATE TABLE IF NOT EXISTS users (
    id int AUTO_INCREMENT PRIMARY KEY,
    username varchar(255),
    password varchar(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    
  )`;

  connection.query(creatTable, (err) => {
    if (err) throw err;
  });
});


module.exports = connection;