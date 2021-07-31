const db = require("../../../db");

const User = async(req, res) => {
  try{
    let response;
    if (req.method === 'POST') {
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

export default User;