var connected = '';
const conectDb = async()=>{
  const mysql = require('mysql2/promise');
  if(connected!=='' && connected.state !== 'disconnected'){
    return connected;
  }
  try{
    var connection = await mysql.createConnection({
      host : process.env.NEXT_PUBLIC_DB_HOST,
      user : process.env.NEXT_PUBLIC_DB_USER,
      password : process.env.NEXT_PUBLIC_DB_PASS,
      database : process.env.NEXT_PUBLIC_DB_DATABASE,
      port: process.env.NEXT_PUBLIC_DB_PORT,
    });
    console.log("Conectou ao MySql");
    connected = connection;
    const querryCreateTable = "("+
      "`id` int NOT NULL AUTO_INCREMENT,"+
      "`name` varchar(220) CHARACTER SET utf8 NOT NULL,"+
      "`description` varchar(220) CHARACTER SET utf8 NOT NULL,"+
      "PRIMARY KEY (`id`)"+
      ")";
    const warning = await connection.query(`CREATE TABLE IF NOT EXISTS ${process.env.NEXT_PUBLIC_DB_TABLE} ${querryCreateTable}`);
    return connection;
  }catch(err){
    console.log("erro ao se conectar com mySql: " + err);
  }
}
conectDb();

const getAll = async()=>{
  const db = await conectDb();
  const [rowns] = await db.query(`SELECT * FROM ${process.env.NEXT_PUBLIC_DB_TABLE}`);
  return rowns;
}

const createItem = async({
  name, 
  description
})=>{
  try{
    const db = await conectDb();
    const [rowns] = await db.query(`INSERT INTO ${process.env.NEXT_PUBLIC_DB_TABLE} (name, description) VALUES ("${name}", "${description}")`);
    if(rowns.affectedRows>0){
      return {status: true, id: rowns.insertId};
    }else{
      return {status: false};
    }
  }catch(err){
    return {status: false};
  }
}

const deleteItem = async({
  id
})=>{
  try{
    const db = await conectDb();
    const [rowns] = await db.query(`DELETE from ${process.env.NEXT_PUBLIC_DB_TABLE} WHERE id=${id}`);
    if(rowns.affectedRows>0){
      return {status: true};
    }else{
      return {status: false};
    }
  }catch(err){
    return {status: false};
  }
}
module.exports={getAll, createItem, deleteItem}