import React from 'react';

const NavigationLinks = () => (
  <div className="vads-u-text-align--right nav-links">
    <a className="nav-links-text" href="/message">
      <i className="fas fa-angle-left" /> Previous
    </a>
    <a className="nav-links-text" href="/message">
      Next <i className="fas fa-angle-right" />
    </a>
  </div>
);

export default NavigationLinks;
