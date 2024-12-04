import React from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2023 Karim Lotfy</p>
      <div className="social-icons">
        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          <FaFacebookF className="social-icon" />
        </a>
        <a
          href="https://www.instagram.com/karim.lotfy00/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          <FaInstagram className="social-icon" />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
