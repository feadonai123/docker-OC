import Router from 'next/router'
const jwt = require('jsonwebtoken');
import cookieCutter from 'cookie-cutter'
import { createContext, useContext, useState } from "react";

const URL = process.env.NEXT_PUBLIC_APP_URL;

export const UserContext = createContext();

export const UserProvider = ({children})=>{
  const [token, setToken] = useState('');
  const [userName, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState();

  const updateData = ({name, email, id, token})=>{
    console.log("=========inicio updateData UserProvider===========")
    console.log("atualizando contexto")
    setUsername(name);
    setEmail(email);
    setId(id);
    setToken(token);
    console.log("=========fim updateData UserProvider===========")
  }
  const logOut = ()=>{
    console.log("=========inicio logOut UserProvider===========")
    cookieCutter.set('token', ".", { expires: new Date(0) })
    console.log("excluiu token");
    setUsername('');
    setEmail('');
    setId('');
    console.log("redirecionando para /");
    console.log("=========fim logOut UserProvider===========")
    Router.push('/');
  }
  const login = async ({text, pass})=>{
    console.log("=========== inicio LOGIN UserProvider============");
    console.log("procurando usuário...");
    const res = await fetch(`http://${URL}/api/users/signIn?`+ new URLSearchParams({
      text: text,
      pass: pass,
    }))
    const response = await res.json();
    if(response.status){
      console.log("usuario existe");
      console.log("criando token");
      const today = new Date();
      const token = jwt.sign({
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        exp: today.getTime() / 1000 + 1000 * 60 * 2,
      }, process.env.NEXT_PUBLIC_JWT_SECRET);
      console.log(token)
      setUsername(token.username);
      setEmail(token.email);
      setId(token.id);
      console.log("alocando token nos cookies")
      cookieCutter.set('token', token)
      setToken(token);
    }else{
      console.log("usuario n existe");
    }
    console.log("saida:")
    console.log(response);
    console.log("=========== fim LOGIN UserProvider============");
    return response;
  }

  return (
    <UserContext.Provider
      value={{
        userName,
        email,
        id,
        token,
        login,
        updateData,
        logOut
      }}>
      {children}
    </UserContext.Provider>
  );
}
export function useUser() {
  const context = useContext(UserContext);
  return context;
}