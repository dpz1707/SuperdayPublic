import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider, Route,
  Navigate
} from "react-router-dom";
import Home from './pages/home/home'
import UpgradePage from './pages/upgrade/upgrade'
import SignUp from './pages/signup/SignUp';
import { Auth0Provider } from '@auth0/auth0-react';
import ReactGA from "react-ga4";
import Dashboard from './pages/dashboard/dashboard';
import EditInfo from './components/dashboard/editInfo';
import UpdatePage from './pages/settings/settings';
import Approve from './pages/approve/approve'
import TOS from './pages/tos/tos'
import Privacy from './pages/privacy/privacy'
import Contact from './pages/contact/contact'

global.curr_client_email = "";

ReactGA.initialize("G-GHT1W1WLLF");

ReactGA.send({ hitType: "pageview", page: window.location.pathname, });

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/upgrade" element={<UpgradePage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/onboard" element={<EditInfo />} />
      <Route path="settings" element={<Navigate replace to="/settings/basicInfo" />} />
      <Route path="settings/:settingName" element={<UpdatePage />} />
      <Route path="approve" element={<Navigate replace to="/approve/all" />} />
      <Route path="approve/:emailType" element={<Approve />} />
      <Route path="/tos" element={<TOS />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/contact" element={<Contact />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-nmrg3qnclxdi6eol.us.auth0.com"
      clientId="yEey8IflUVIMxvW7fPCsQ4fAlQ5BJzP7"
      useRefreshTokens={true}
      cacheLocation="localstorage"
      redirectUri={window.location.origin + '/dashboard'}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >      <RouterProvider router={router} />
    </Auth0Provider>
  </React.StrictMode>
);

reportWebVitals();
