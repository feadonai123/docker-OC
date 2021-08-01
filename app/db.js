const bcrypt = require('bcrypt');
var connected = '';
const conectDb = async()=>{
  const mysql = require('mysql2/promise');
  if(connected!=='' && connected.state !== 'disconnected'){
    console.log("ja estamos conectado ao MySql");
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
      "`description` varchar(1000) CHARACTER SET utf8 NOT NULL,"+
      "`username` varchar(45) CHARACTER SET utf8 NOT NULL,"+
      "PRIMARY KEY (`id`)"+
      ")";

    const querryCreateTableUsers= "("+
    "`id` INT NOT NULL AUTO_INCREMENT,"+
    "`username` VARCHAR(45) NOT NULL,"+
    "`email` VARCHAR(45) NOT NULL,"+
    "`password` VARCHAR(220) NOT NULL,"+
    "PRIMARY KEY (`id`),"+
    "UNIQUE INDEX `id_UNIQUE` (`id` ASC),"+
    "UNIQUE INDEX `username_UNIQUE` (`username` ASC),"+
    "UNIQUE INDEX `email_UNIQUE` (`email` ASC));"
    await connection.query(`CREATE TABLE IF NOT EXISTS ${process.env.NEXT_PUBLIC_DB_TABLE} ${querryCreateTable}`);
    await connection.query(`CREATE TABLE IF NOT EXISTS users ${querryCreateTableUsers}`);
    
    return connection;
  }catch(err){
    console.log("erro ao se conectar com mySql: " + err);
  }
}

const getAll = async()=>{
  const db = await conectDb();
  const [rowns] = await db.query(`SELECT * FROM ${process.env.NEXT_PUBLIC_DB_TABLE}`);
  return rowns;
}

const createItem = async({
  name, 
  description,
  username
})=>{
  try{
    const db = await conectDb();
    const [rowns] = await db.query(`INSERT INTO ${process.env.NEXT_PUBLIC_DB_TABLE} (name, description, username) VALUES ("${name}", "${description}", "${username}")`);
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

const createUser = async({
  name, 
  email,
  pass
})=>{
  try{
    const db = await conectDb();
    const [rowns] = await db.query(`INSERT INTO users (username, email, password) VALUES ("${name}", "${email}", "${pass}")`);
    if(rowns.affectedRows>0){
      return {status: true, id: rowns.insertId};
    }else{
      return {status: false, msg: 'Algo deu errado. Tente novamente mais tarde'};
    }
  }catch(err){
    console.log("erro ao criar usuario: " + err);
    return {status: false, msg: err.sqlMessage};
  }
}
const findUser = async({
  text,
  pass
})=>{
  try{
    console.log("find user");
    const db = await conectDb();
    const [rowns] = await db.query(`SELECT * FROM users WHERE (username = "${text}" OR email = "${text}")`);
    if(rowns.length>0){
      const isValidPass = await bcrypt.compare(pass, rowns[0].password);
      console.log("senha valiuda: " + isValidPass);
      if(isValidPass){
        return {status: true, data: rowns[0]};
      }else{
        return {status: false, msg: "Usuário ou senha incorretos"};
      }
    }else{
      return {status: false, msg: "Usuário ou senha incorretos"};
    }
  }catch(error){
    console.log("erro ao procurar usuario: " + err);
    return {status: false, msg: err.sqlMessage};
  }
}

const findUserByToken = async({
  username
})=>{
  try{
    console.log("find user by token");
    const db = await conectDb();
    const [rowns] = await db.query(`SELECT * FROM users WHERE (username = "${username}")`);
    if(rowns.length>0){
      return {status: true, data: rowns[0]};
    }else{
      return {status: false, msg: "Token invalido"};
    }
  }catch(error){
    console.log("erro ao procurar usuario via token: " + err);
    return {status: false, msg: err.sqlMessage};
  }
}
module.exports={getAll, createItem, deleteItem, createUser, findUser, findUserByToken}