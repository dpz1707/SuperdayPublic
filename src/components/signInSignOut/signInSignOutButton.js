import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./logInButton";
import SignOutButton from './signOutButton';

export default function SignInSignOutButton(props) {
  const { isAuthenticated } = useAuth0();

  return (
    isAuthenticated ? <SignOutButton location = {props.location} /> : <LoginButton title = {props.title} location = {props.location}/>
  );
}