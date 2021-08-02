const db = require('../../db');
const jwt = require('jsonwebtoken');


export default async function Items(req, res){
  console.log("=================API ITEMS===================")
  try{
    let response;
    if (req.method === 'POST') {
      console.log("Pedido para criar item")
      const tokenData = jwt.verify(req.headers.token, process.env.NEXT_PUBLIC_JWT_SECRET);
      response = await createItem(req.body, tokenData.username);
    }else if(req.method === 'GET'){
      console.log("Pedido para pegar item")
      response = await getAllItem();
    }else if(req.method === 'DELETE'){
      console.log("Pedido para deletar item")
      response = await deleteItem(req.body)
    }
    console.log("SAIDA:")
    console.log(response);
    console.log("=================FIM API ITEMS===================")
    res.status(200).json(response);
  }catch(error){
    console.log("saiu com erro")
    console.log(error);
    console.log("=================FIM API ITEMS===================")
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

export const getAllItem = async()=>{
  console.log("======inicio getAll item api items ====")
  const items = await db.getAll();
  console.log("saida:")
  console.log(items);
  console.log("======fim getAll item api items ====")
  return(items);
}