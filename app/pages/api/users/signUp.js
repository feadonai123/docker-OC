const db = require('../../../db');
const bcrypt = require('bcrypt');

const SignUp = async(req, res) => {
  console.log("=========INICIO SIGNIN API==============")
  try{
    let response;
    if (req.method === 'POST') {
      console.log("pedido para criar usuario");
      response = await createUser(req.body);
    }
    console.log("saida:")
    console.log(response);
    console.log("===================fim api SIGNIN==========")
    res.status(200).json(response);
  }catch(error){
    console.log("saida com erro: ");
    console.log(error);
    console.log("=========fim SIGNIN API==============")
    res.status(500).json(error);
  }
}

const createUser = async (data)=>{
  const {email, username, pass} = data;
  const salt = bcrypt.genSaltSync();
  const passHash = bcrypt.hashSync(pass, salt);
  const response = await db.createUser({
    name: username,
    email: email,
    pass: passHash,
  })
  return response;
}

export default SignUp;