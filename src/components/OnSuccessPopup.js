import React, { useEffect, useState } from 'react';

export default function OnSuccessPopup({ showSuccessMessage, successMessage }) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (showSuccessMessage) {
      setShouldRender(true); // Ensure the component is rendered in the DOM
      const fadeInTimeout = setTimeout(() => {
        setIsVisible(true); // Start fading in after the component is rendered
      }, 10); // Small delay to ensure CSS transition applies correctly

      // After 2 seconds plus fade-out duration, start fading out
      const fadeOutTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 2000 + 500); // Visible duration + fade-out duration

      // Remove component from DOM after fade-out completes
      const removeTimeout = setTimeout(() => {
        setShouldRender(false);
      }, 2000 + 1000); // Visible duration + fade-in + fade-out durations

      return () => {
        clearTimeout(fadeInTimeout);
        clearTimeout(fadeOutTimeout);
        clearTimeout(removeTimeout);
      };
    } else {
      // If `showSuccessMessage` is false, immediately start hiding the component
      setIsVisible(false);
      // Remove component from DOM after fade-out completes
      const timeoutId = setTimeout(() => {
        setShouldRender(false);
      }, 500); // Fade-out duration
      return () => clearTimeout(timeoutId);
    }
  }, [showSuccessMessage]);

  if (!shouldRender) {
    return null; // Don't render the component if it shouldn't be in the DOM
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      background: '#333',
      color: '#fff',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      minWidth: '300px',
      maxWidth: '90%',
      zIndex: 50,
      padding: '20px',
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out',
    }}>
      <div className="flex items-center">
        <svg className="w-6 h-6 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zM8 15l-5-5 1.41-1.41L8 12.17l7.59-7.59L17 6l-9 9z"/>
        </svg>
        <div>
          <p className="font-semibold">Success!</p>
          <p className="text-sm">{successMessage}</p>
        </div>
      </div>
    </div>
  );
}
