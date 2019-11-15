// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { get } from 'lodash';
// Relative
import { NavItemPropType } from './NavItem';

const ExpandCollapseButton = ({ depth, item }) => {
  // Derive item properties.
  const expanded = get(item, 'expanded');
  const label = get(item, 'label', '');
  const hasChildren = get(item, 'hasChildren');

  // Determine if we are deeper than the 2nd level of nav items.
  const secondLevelOrDeeper = depth >= 2;

  // Do not render if we do not have children or are a top-level nav item.
  if (!hasChildren || !secondLevelOrDeeper) {
    return null;
  }

  return (
    <button
      aria-label={`${expanded ? 'Collapse' : 'Expand'} ${label}`}
      className="va-sidenav-toggle-expand"
    >
      <i
        className={classNames({
          fa: true,
          'fa-chevron-down': expanded,
          'fa-chevron-up': !expanded,
        })}
      />
    </button>
  );
};

ExpandCollapseButton.propTypes = {
  depth: PropTypes.number.isRequired,
  item: NavItemPropType,
};

export default ExpandCollapseButton;
