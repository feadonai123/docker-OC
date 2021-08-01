const db = require('../../db');
const jwt = require('jsonwebtoken');


const Items = async(req, res)=>{
  try{
    let response;
    if (req.method === 'POST') {
      // Cria item
      const tokenData = jwt.verify(req.headers.token, process.env.NEXT_PUBLIC_JWT_SECRET);
      console.log("criar item...");
      response = await createItem(req.body, tokenData.username);
    }else if(req.method === 'GET'){
      // Pega item
      console.log("pegar items...");
      response = await getAllItem();
    }else if(req.method === 'DELETE'){
      // Deleta item
      console.log("deletar item...");
      response = await deleteItem(req.body)
    }
    console.log("resposta API:")
    console.log(response)
    res.status(200).json(response);
  }catch(error){
    res.status(500).json(error);
  }
}


const createItem = async(body, username)=>{
  const {name, description} = body;
  const response = await db.createItem({
    name: name,
    description: description,
    username: username
  });
  return(response);
}

const deleteItem = async(body)=>{
  const {id} = body;
  const response = await db.deleteItem({
    id: id
  });
  return(response);
}

const getAllItem = async()=>{
  const items = await db.getAll();
  return(items);
}

export default Items;