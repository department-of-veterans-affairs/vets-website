import React from 'react';
import { mhvNavItems } from '../data';

const Dropdown = () => {
  const links = mhvNavItems.map(({ href, title }) => (
    <li key={href}>
      <a href={href}>{title}</a>
    </li>
  ));

  return (
    <div className="mhv-dropdown">
      <button
        className="mhv-dropdown-trigger"
        aria-controls="mhv-dropdown-menu"
        aria-expanded="false"
        type="button"
      >
        More
      </button>
      <div className="mhv-dropdown-menu">
        <ul className="usa-unstyled-list">{links}</ul>
      </div>
    </div>
  );
};

export default Dropdown;
