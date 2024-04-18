import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = (props) => {
  const { loginWithRedirect } = useAuth0();

  

  const handleLogin = () => {
    loginWithRedirect({
      // Specify the redirect URI after login
      redirectUri: `${window.location.origin}/dashboard`
    }).catch(error => {
      alert('Login failed');
      console.error('Login failed:', error);
    });
  };

  

  const navStyles = "border px-16 py-2 border-black text-black text-md rounded-full";
  const landingStyles = "border px-32 py-3 border-black rounded-full text-white text-md bg-black hover:bg-transparent hover:text-black transition-colors duration-500 ease-in-out";

  const buttonStyles = props.location === 'nav' ? navStyles : landingStyles;

  return (
    <button
      className={buttonStyles}
      onClick={handleLogin}
    >
      {props.title}
    </button>
  );
};

export default LoginButton;
