// Dependencies
import React from 'react';
import { get } from 'lodash';
// Relative
import { NavItemPropTypes } from '../prop-types';

const LabelText = ({ item }) => {
  // Derive item properties.
  const label = get(item, 'label', '');
  const isSelected = get(item, 'isSelected');
  // Is level 4 or deeper
  const isLevelFourOrDeeper = item.depth >= 4;

  // Return the normal label element.
  return (
    <div
      className={`va-sidenav-item-label-text${
        isLevelFourOrDeeper && !isSelected ? ' grandchild-left-line' : ''
      }`}
    >
      {label}
    </div>
  );
};

LabelText.propTypes = {
  item: NavItemPropTypes,
};

export default LabelText;
