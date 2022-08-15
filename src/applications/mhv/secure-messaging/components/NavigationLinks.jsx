import React from 'react';

const NavigationLinks = () => (
  <div className="vads-u-text-align--right nav-links">
    <a
      className="nav-links-text"
      href="/message"
      aria-label="Navigate to previous message"
    >
      <i className="fas fa-angle-left" /> Previous
    </a>
    <a
      className="nav-links-text"
      href="/message"
      aria-label="Navigate to next message"
    >
      Next <i className="fas fa-angle-right" />
    </a>
  </div>
);

export default NavigationLinks;
