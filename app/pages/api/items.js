const db = require('../../db');

const Items = async(req, res)=>{
  try{
    let response;
    if (req.method === 'POST') {
      // Cria item
      console.log("criar item...");
      response = await createItem(req.body);
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


const createItem = async(body)=>{
  const {name, description} = body;
  const response = await db.createItem({
    name: name,
    description: description,
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