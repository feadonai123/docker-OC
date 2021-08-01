const db = require("../../../db");
const jwt = require('jsonwebtoken');

const Login = async(req, res) => {
  try{
    let response;
    if (req.method === 'POST') {
      response = await checkToken(req.body);
    }else if(req.method === 'GET'){
      response = await findUser(req.query);
    }
    console.log("resposta API:")
    console.log(response)
    res.status(200).json(response);
  }catch(error){
    res.status(500).json(error);
  }
}

const findUser = async (data)=>{
  const {text, pass} = data;
  console.log(`procurando usuario: ${text}`);
  const response = await db.findUser({
    text: text,
    pass: pass,
  })
  return response;
}

const checkToken = async (data)=>{
  console.log("chegando token");
  const {token} = data;
  if(!token){
    console.log("tokem n existe");
    return({status: false, msg: 'token doesnt exist'});
  }
  const tokenData = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
  console.log(tokenData);
  const response = await db.findUserByToken({
    username: tokenData.username,
  })
  console.log(tokenData);
  console.log(response);

  return response;
}

export default Login;