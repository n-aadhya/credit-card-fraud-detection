import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const styles = {
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#242424',
      padding: '1rem 2rem',
      color: 'white',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    links: {
      listStyle: 'none',
      display: 'flex',
      gap: '2rem',
      margin: 0,
    },
    link: {
      color: 'white',
      textDecoration: 'none',
      fontWeight: 500,
      transition: 'color 0.3s',
      cursor:'pointer',
    },
    linkHover: {
      color: '#61dafb',
    }
  };

//   return (
//     <nav style={styles.navbar}>
//       <div style={styles.logo}>💳 Fraud Detector</div>
//       <ul style={styles.links}>
//         <li><a href="#home" style={styles.link}>Home</a></li>
//         <li><a href="#predict" style={styles.link}>Predict</a></li>
//         <li><a href="#visual" style={styles.link}>Predict</a></li>
//         <li><a href="#about" style={styles.link}>About</a></li>
//       </ul>
//     </nav>
//   );
return (
    <nav style={styles.navbar}>
    <div style={styles.logo}>💳 Fraud Detector</div>
      {/* <h2 className="logo">FraudDetect</h2> */}
      <ul style={styles.links}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        <li><Link to="/predict" style={styles.link}>Predict Fraud</Link></li>
        <li><Link to="/analytics" style={styles.link}>Visual Analytics</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
