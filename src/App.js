import { Routes, Route, Link, Outlet, useLocation } from 'react-router-dom';
import Nav from './pages/nav/nav';
import Footer from './components/Footer';
import React, { useEffect } from 'react';
import { gapi } from 'gapi-script';

function App() {
  const location = useLocation();

  // List of pathnames that should not render the header and footer
  const noHeaderFooter = ['signup', 'dashboard', 'onboard', 'settings', 'approve', 'tos', 'privacy'];

  // Helper function to determine if the header and footer should be rendered
  const shouldRenderHeaderFooter = () => {
    // Splitting the pathname to handle nested routes
    const pathSegments = location.pathname.split('/').filter(Boolean); // Filter Boolean to remove empty strings
    // Check if any segment of the current pathname is in the noHeaderFooter array
    return !pathSegments.some(segment => noHeaderFooter.includes(segment));
  };

  return (
    <div className="App">
      {shouldRenderHeaderFooter() && <Nav />}
      <Outlet />
      {shouldRenderHeaderFooter() && <Footer />}
    </div>
  );
}

export default App;
