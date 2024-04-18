import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { FaSignOutAlt } from "react-icons/fa";

const LogoutButton = ({ className, logoutOptions, location }) => {
  const { logout } = useAuth0();

  const defaultClassName = "border px-16 py-2 border-black text-black text-md rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-500 ease-in-out";
  const justTextClassName = "text-black bg-transparent border-none";

  let buttonClassName, content;
  if (location === 'justText') {
    buttonClassName = justTextClassName;
    content = <FaSignOutAlt style={{ transform: 'scaleX(-1)' }} />;
  } else {
    buttonClassName = className ? `${defaultClassName} ${className}` : defaultClassName;
    content = "Log Out";
  }

  return (
    <button
      className={`${buttonClassName} flex items-center gap-2`}
      onClick={() => logout({
        ...logoutOptions,
        returnTo: window.location.origin,
      })}
    >
      {content}
    </button>
  );
};

LogoutButton.defaultProps = {
  className: "",
  logoutOptions: {},
  location: "",
};

export default LogoutButton;
