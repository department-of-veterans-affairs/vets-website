import React from 'react';

const NavigationLinks = () => (
  <div className="vads-u-text-align--right nav-links">
    <a
      className="nav-links-text"
      href="http://localhost:3001/my-health/secure-messages/reply/"
    >
      <i className="fas fa-angle-left" /> Previous
    </a>
    <a
      className="nav-links-text"
      href="http://localhost:3001/my-health/secure-messages/reply/"
    >
      Next <i className="fas fa-angle-right" />
    </a>
  </div>
);

export default NavigationLinks;
