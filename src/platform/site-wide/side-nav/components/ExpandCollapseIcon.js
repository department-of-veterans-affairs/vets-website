// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { get } from 'lodash';
// Relative
import { NavItemPropTypes } from '../prop-types';

const ExpandCollapseButton = ({ depth, item }) => {
  // Derive item properties.
  const expanded = get(item, 'expanded');
  const hasChildren = get(item, 'hasChildren');

  // Determine if we are deeper than the 2nd level of nav items.
  const secondLevelOrDeeper = depth >= 2;

  // Do not render if we do not have children or are a top-level nav item.
  if (!hasChildren || !secondLevelOrDeeper) {
    return null;
  }

  return (
    <span className="va-sidenav-toggle-expand">
      <i
        className={classNames('fa', {
          'fa-chevron-up': expanded,
          'fa-chevron-down': !expanded,
        })}
      />
    </span>
  );
};

ExpandCollapseButton.propTypes = {
  depth: PropTypes.number.isRequired,
  item: NavItemPropTypes,
};

export default ExpandCollapseButton;
