import React from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <p>&copy; 2023 Karim Lotfy</p>
      <div className={styles.socialIcons}>
        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
        >
          <FaFacebookF className={styles.socialIcon} />
        </a>
        <a
          href="https://www.instagram.com/karim.lotfy00/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
        >
          <FaInstagram className={styles.socialIcon} />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
