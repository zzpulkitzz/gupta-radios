import React from 'react';
import '../styles/theme.css';
import '../styles/contact.css';

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <h2>Contact Us</h2>

      <div className="contact-card">
        <div className="contact-item">
          <span className="contact-icon">📞</span>
          <div>
            <strong>Sales:</strong>{" "}
            <a href="tel:7500701500" className="contact-link">7500701500</a>
          </div>
        </div>

        <div className="contact-item">
          <span className="contact-icon">🛟</span>
          <div>
            <strong>Support:</strong>{" "}
            <a href="tel:7500709200" className="contact-link">7500709200</a>
          </div>
        </div>

        <div className="contact-item">
          <span className="contact-icon">✉️</span>
          <div>
            <strong>Email:</strong>{" "}
            <a href="mailto:guptaradios05943@gmail.com" className="contact-link">
              guptaradios05943@gmail.com
            </a>
          </div>
        </div>

        <div className="contact-divider"></div>

        <div className="contact-item address">
          <span className="contact-icon">📍</span>
          <div>
            <strong>Address:</strong>
            <p>
              Main Market, Tanakpur,<br />
              Champawat, Uttarakhand – 262309
            </p>
            <a
              href="https://www.google.com/maps/dir//Gupta+Radios,+main+market,+Tanakpur,+Uttarakhand+262309/@29.0638059,80.1093562,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x39a100168d42a34f:0x7fae29e7dd5a52ee!2m2!1d80.1139016!2d29.0723807?entry=ttu"
              target="_blank"
              rel="noopener noreferrer"
              className="map-link"
            >
              View on Google Maps →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
