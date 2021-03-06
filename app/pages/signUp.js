import { useState } from "react";
import Router from 'next/router'
import Head from 'next/head'
const URL = process.env.NEXT_PUBLIC_APP_URL;


const SignUp = ()=>{
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [msgError, setMsgError] = useState("");
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');

  const handleSubmit = async(event)=>{
    console.log("==========inicio signUp handleSubmit================")
    console.log("Clicado em registrar");
    event.preventDefault();
    setMsgError('');
    if(email==='' || username===''){
      console.log("Preencha todos os campos");
      console.log("============fim signUp handleSubmit=============")
      setMsgError('*Preencha todos os campos');
      return;
    }
    if(pass!==pass2){
      console.log("As senhas digitadas não coincidem");
      console.log("============fim signUp handleSubmit=============")
      setMsgError('*As senhas digitadas não coincidem');
      return;
    }
    if(pass.length<8){
      console.log("A senha precisa ter mais de 8 caracteres");
      console.log("============fim signUp handleSubmit=============")
      setMsgError('*A senha precisa ter mais de 8 caracteres');
      return;
    }
    console.log("acesso a API");
    const res = await fetch(`http://${URL}/api/users/signUp`, {
      method: 'POST',
      body: JSON.stringify({ 
        email: email,
        username: username,
        pass: pass,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    const response = await res.json();
    console.log("resposta:");
    console.log(response);
    if(response.status){
      console.log("usuario criado");
      setMsgError(`"${username}" foi registrado com sucesso`);
    }else{
      console.log("usuario n criado;");
      console.log(response.msg);
      setMsgError(`ERRO: ${response.msg}`);
    }
    setEmail('');
    setUsername('');
    setPass('');
    setPass2('');
    console.log("============fim signUp handleSubmit=============")
  }
  return(
    <div style={{
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '50px',
      backgroundColor: '#f71',
      height: '100vh',
    }}>
      <Head>
        <title>Registrar</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form onSubmit={handleSubmit} style={{
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0px 50px',
        backgroundColor: 'aliceblue',
        borderRadius: '20px',
        width: '40vw',
      }}>
        <div style={{
          alignItems: 'flex-start',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <h1 style={{alignSelf: 'center'}}>Registrar</h1>
          <h3 style={{marginBottom: '5px'}}>E-mail:</h3>
          <input 
            type="email" 
            placeholder="E-mail"
            value={email}
            onChange={(e)=>setEmail(e.target.value)} 
            style={{
              width: '100%',
              borderRadius: '20px',
              padding: '5px 20px',
              boxShadow: '0 0 0 0',
              borderWidth: '2px',
              borderColor: '#f71',
              outline: 0,
            }}
          />
          <h3 style={{marginBottom: '5px'}}>Nome do usuário:</h3>
          <input 
            type="text" 
            placeholder="Nome" 
            value={username}
            onChange={(e)=>setUsername(e.target.value)} 
            style={{
              width: '100%',
              borderRadius: '20px',
              padding: '5px 20px',
              boxShadow: '0 0 0 0',
              borderWidth: '2px',
              borderColor: '#f71',
              outline: 0,
            }}
          />
          <h3 style={{marginBottom: '5px'}}>Senha:</h3>
          <input 
            type="password" 
            placeholder="Senha" 
            value={pass}
            onChange={(e)=>setPass(e.target.value)} 
            style={{
              width: '100%',
              borderRadius: '20px',
              padding: '5px 20px',
              boxShadow: '0 0 0 0',
              borderWidth: '2px',
              borderColor: '#f71',
              outline: 0,
            }}
          />
          <h3 style={{marginBottom: '5px'}}>Confirmar Senha:</h3>
          <input 
            type="password" 
            placeholder="Senha" 
            value={pass2}
            onChange={(e)=>setPass2(e.target.value)} 
            style={{
              width: '100%',
              borderRadius: '20px',
              padding: '5px 20px',
              boxShadow: '0 0 0 0',
              borderWidth: '2px',
              borderColor: '#f71',
              outline: 0,
            }}
          /><br/>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
          <div style={{width: '100%'}}>
            <input 
              type="submit" 
              value="Registrar"
              style={{
                marginTop: '20px', 
                borderRadius: '20px', 
                padding: '10px 20px',
                boxShadow: '0 0 0 0',
                borderWidth: '2px',
                borderColor: '#f71',
                outline: 0,
                backgroundColor: 'aliceblue',  
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,  
                width: '50%',       
              }}
            />
            <input 
              type="button" 
              value="Voltar"
              style={{
                marginTop: '20px', 
                borderRadius: '20px', 
                padding: '10px 20px',
                boxShadow: '0 0 0 0',
                borderWidth: '2px',
                borderColor: '#f71',
                outline: 0,
                backgroundColor: 'aliceblue',
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                width: '50%',       
              }}
              onClick={()=>Router.push('/signIn')}//mudar para home porém tento td o negocio de token e cookie
            />
          </div>
        </div>
        <p style={{color: '#f00', textAlign: 'center', margin: '5px 0px', fontSize: '12px', visibility: msgError===''&&'hidden'}}>{msgError===''?'.':msgError}</p>
      </form>
    </div>
  );
}
/*
<label>Anexo</label>
<input type="file" id="anexo" name="anexo" />
*/
export default SignUp;

/*
export async function getStaticProps(context) {
  
  const {req} = context;
  console.log(req.headers.host);
  const url = req.headers.host;
  return { props: { url } }
}*/