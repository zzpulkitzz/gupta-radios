import React, { useState } from 'react';
import '../styles/whatsapp-button.css';

const WhatsAppButton = () => {
  const phoneNumber = "7500701500"; // Without country code for tel: link
  const fullPhoneNumber = "917500701500"; // With country code for WhatsApp
  const [showCallButton, setShowCallButton] = useState(false);

  const message = encodeURIComponent(
    "Hello Gupta Radios, I would like to know more about your products."
  );

  const toggleCallButton = () => {
    setShowCallButton(!showCallButton);
  };

  return (
    <div className="floating-buttons">
      {showCallButton && (
        <a
          href={`tel:${phoneNumber}`}
          className="call-button"
          aria-label="Call Now"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
          </svg>
          <span>Call Now</span>
        </a>
      )}
      
      <button 
        className="whatsapp-button" 
        onClick={toggleCallButton}
        aria-label={showCallButton ? "Hide call button" : "Show call button"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M20.52 3.48A11.91 11.91 0 0 0 12.04 0C5.4 0 .01 5.38 0 12.02c0 2.12.55 4.2 1.6 6.04L0 24l6.11-1.6a11.93 11.93 0 0 0 5.93 1.52h.01c6.64 0 12.03-5.38 12.03-12.02a11.9 11.9 0 0 0-3.56-8.42Zm-8.48 18.4h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.63.95.97-3.54-.23-.36a9.96 9.96 0 1 1 8.3 4.54Zm5.46-7.48c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.89-.8-1.49-1.79-1.66-2.09-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.64-.93-2.25-.24-.57-.48-.49-.68-.5h-.58c-.2 0-.52.07-.8.37-.28.3-1.05 1.02-1.05 2.49 0 1.47 1.08 2.89 1.23 3.09.15.2 2.13 3.26 5.16 4.57.72.31 1.28.5 1.71.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
        </svg>
      </button>
      
      <a
        href={`https://wa.me/${fullPhoneNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
        aria-label="Chat on WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M20.52 3.48A11.91 11.91 0 0 0 12.04 0C5.4 0 .01 5.38 0 12.02c0 2.12.55 4.2 1.6 6.04L0 24l6.11-1.6a11.93 11.93 0 0 0 5.93 1.52h.01c6.64 0 12.03-5.38 12.03-12.02a11.9 11.9 0 0 0-3.56-8.42Zm-8.48 18.4h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.63.95.97-3.54-.23-.36a9.96 9.96 0 1 1 8.3 4.54Zm5.46-7.48c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.89-.8-1.49-1.79-1.66-2.09-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.64-.93-2.25-.24-.57-.48-.49-.68-.5h-.58c-.2 0-.52.07-.8.37-.28.3-1.05 1.02-1.05 2.49 0 1.47 1.08 2.89 1.23 3.09.15.2 2.13 3.26 5.16 4.57.72.31 1.28.5 1.71.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
        </svg>
      </a>
    </div>
  );
};

export default WhatsAppButton;
