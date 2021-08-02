const db = require("../../../db");
const jwt = require('jsonwebtoken');

export default async function Login(req, res){
  console.log("===================inicio api LOGIN==========")
  try{
    let response;
    if (req.method === 'POST') {
      console.log("request para checar o token")
      response = await checkToken(req.body);
    }else if(req.method === 'GET'){
      console.log("request para encontrar um usuário")
      response = await findUser(req.query);
    }
    console.log("saida:")
    console.log(response);
    console.log("===================fim api LOGIN==========")
    res.status(200).json(response);
  }catch(error){
    console.log("saida com erro:")
    console.log(error);
    console.log("===================fim api LOGIN==========")
    res.status(500).json(error);
  }
}

const findUser = async (data)=>{
  const {text, pass} = data;
  const response = await db.findUser({
    text: text,
    pass: pass,
  })
  return response;
}

export const checkToken = async (data)=>{
  console.log("=========inicio Check Token singIn=========")
  const {token} = data;
  if(!token){
    console.log("token inexistente");
    console.log("=========fim Check Token singIn=========")
    return({status: false, msg: 'token doesnt exist'});
  }
  const tokenData = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
  const response = await db.findUserByToken({
    username: tokenData.username,
  })
  console.log("saida: ");
  console.log(response);
  console.log("=========fim Check Token singIn=========")
  return response;
}