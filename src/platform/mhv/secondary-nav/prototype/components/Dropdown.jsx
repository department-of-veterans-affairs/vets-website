import React from 'react';
import { mhvNavItems } from '../data';

const Dropdown = () => {
  const links = mhvNavItems.map(({ href, title }) => (
    <li key={href}>
      <a href={href}>{title}</a>
    </li>
  ));

  return (
    <>
      <button
        className="mhv-dropdown"
        aria-controls="mhv-dropdown-menu"
        aria-expanded="false"
        type="button"
      >
        More
      </button>
      <div className="mhv-dropdown-menu">
        <ul className="usa-unstyled-list">{links}</ul>
      </div>
    </>
  );
};

export default Dropdown;
