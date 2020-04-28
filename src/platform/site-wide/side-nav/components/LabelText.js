// Dependencies
import React from 'react';
import { get } from 'lodash';
import classNames from 'classnames';
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
      className={classNames('va-sidenav-item-label-text', {
        'grandchild-left-line': isLevelFourOrDeeper && !isSelected,
      })}
    >
      {label}
    </div>
  );
};

LabelText.propTypes = {
  item: NavItemPropTypes,
};

export default LabelText;
