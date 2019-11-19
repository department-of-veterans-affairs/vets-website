// Dependencies
import React from 'react';
import { get } from 'lodash';
// Relative
import { NavItemPropTypes } from '../prop-types';

const LabelText = ({ item }) => {
  // Derive item properties.
  const label = get(item, 'label', '');

  // Return the normal label element.
  return <div className="va-sidenav-item-label-text">{label}</div>;
};

LabelText.propTypes = {
  item: NavItemPropTypes,
};

export default LabelText;
