require('dotenv/config');
const express = require('express');
const app = express();
const port = process.env.APP_PORT;
const host = process.env.APP_URL;

app.get("/", (req, res)=>{
  res.send("hello word");
})

app.listen(port, ()=>{
  console.log(`server is running on: localhost:${port}`)
})