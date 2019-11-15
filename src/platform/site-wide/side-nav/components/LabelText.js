// Dependencies
import React from 'react';
import { get } from 'lodash';
// Relative
import { NavItemPropTypes } from '../prop-types';

const LabelText = ({ item }) => {
  // Derive item properties.
  const href = get(item, 'href');
  const label = get(item, 'label', '');

  // Return the label element as a link.
  if (href) {
    return (
      <a
        className="va-sidenav-item-label-link"
        href={href}
        rel="noopener noreferrer"
      >
        {label}
      </a>
    );
  }

  // Return the normal label element.
  return <div className="va-sidenav-item-label-text">{label}</div>;
};

LabelText.propTypes = {
  item: NavItemPropTypes,
};

export default LabelText;
