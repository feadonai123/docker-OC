import Router from 'next/router'
const jwt = require('jsonwebtoken');
import cookieCutter from 'cookie-cutter'
import { createContext, useContext, useState } from "react";
export const UserContext = createContext();

export const UserProvider = ({children})=>{
  const [token, setToken] = useState('');
  const [userName, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState();

  const updateData = ({name, email, id, token})=>{
    setUsername(name);
    setEmail(email);
    setId(id);
    setToken(token);
    console.log("alterou user para " + name)
  }
  const logOut = ()=>{
    console.log("logOut");
    cookieCutter.set('token', ".", { expires: new Date(0) })
    setUsername('');
    setEmail('');
    setId('');
    Router.push('/');
  }
  const login = async ({text, pass, url})=>{
    const res = await fetch(`http://${url}/api/users/signIn?`+ new URLSearchParams({
      text: text,
      pass: pass,
    }))
    const response = await res.json();
    console.log(response);
    if(response.status){
      const today = new Date();
      const token = jwt.sign({
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        exp: today.getTime() / 1000 + 1000 * 60 * 2,
      }, process.env.NEXT_PUBLIC_JWT_SECRET);
      setUsername(token.username);
      setEmail(token.email);
      setId(token.id);
      cookieCutter.set('token', token)
      setToken(token);
    }
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