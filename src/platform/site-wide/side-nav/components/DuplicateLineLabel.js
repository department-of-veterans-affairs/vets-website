// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { get } from 'lodash';
// Relative
import { NavItemPropTypes } from '../prop-types';
import LabelText from './LabelText';

const DuplicateLineLabel = ({ depth, item }) => {
  // Derive the item properties.
  const expanded = get(item, 'expanded');
  const hasChildren = get(item, 'hasChildren');
  const href = get(item, 'href');
  const isSelected = get(item, 'isSelected');

  // Determine if the nav item is 2nd level.
  const isSecondLevel = depth === 2;

  // Do not render if we are collapsed.
  if (!expanded) {
    return null;
  }

  // Do not render if the nav item is not 2nd level.
  if (!isSecondLevel) {
    return null;
  }

  // Do not render if the nav item has no children.
  if (!hasChildren) {
    return null;
  }

  return (
    <>
      <div className="line" />
      <a
        className={classNames(
          'va-sidenav-item-label',
          'va-sidenav-item-label-underlined',
          {
            selected: isSelected,
          },
        )}
        href={href}
        rel="noopener noreferrer"
      >
        <LabelText item={item} />
      </a>
    </>
  );
};

DuplicateLineLabel.propTypes = {
  depth: PropTypes.number.isRequired,
  item: NavItemPropTypes,
};

export default DuplicateLineLabel;
