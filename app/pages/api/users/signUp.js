const db = require('../../../db');
const bcrypt = require('bcrypt');

const SignUp = async(req, res) => {
  try{
    let response;
    if (req.method === 'POST') {
      // Cria User
      console.log("criar item...");
      response = await createUser(req.body);
    }
    console.log("resposta API:")
    console.log(response)
    res.status(200).json(response);
  }catch(error){
    res.status(500).json(error);
  }
}

const createUser = async (data)=>{
  const {email, username, pass} = data;
  console.log(`criando usuario: ${email}, ${username}`);
  const salt = bcrypt.genSaltSync();
  console.log("passo1");
  const passHash = bcrypt.hashSync(pass, salt);
  console.log(passHash);
  console.log("aqui");
  const response = await db.createUser({
    name: username,
    email: email,
    pass: passHash,
  })
  return response;
}

export default SignUp;