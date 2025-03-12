const mysql = require('mysql2');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'huysql2004', 
    database: 'db1' 
  }).promise();



connection.getConnection((err) => {
  if (err) {
    console.error('MySQL connect error', err);
    return;
  }
  console.log('MySQL connect success!');
  
  const creatTable = `
  CREATE TABLE IF NOT EXISTS users (
    id int AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255),
    role VARCHAR(255) DEFAULT 'user',
    active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
  )`;

  connection.execute(creatTable, (err) => {
    if (err) throw err;
  });
});


module.exports = connection;