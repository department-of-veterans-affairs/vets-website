// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// Relative
import NavItemRow from './NavItemRow';
import { NavItemPropTypes } from '../prop-types';

const NavItem = ({ depth, item, renderChildItems, toggleItemExpanded }) => {
  // Derive the item properties.
  const { expanded, hasChildren, id, isSelected } = item;

  // Expanded not selected
  const isExpanded = expanded && depth === 2 && !isSelected;
  // Expanded beyond level 2 expanded and selected
  const moreThanLevel2SelectedExpanded = expanded && depth > 2 && isSelected;

  const isExpandedNotSelected = !!(
    isExpanded &&
    !moreThanLevel2SelectedExpanded &&
    hasChildren
  );
  const shouldHaveSelectedClassName =
    (!isExpanded &&
      !moreThanLevel2SelectedExpanded &&
      hasChildren &&
      isSelected) ||
    isExpandedNotSelected;

  return (
    <li
      className={classNames(`va-sidenav-level-${depth}`, {
        active: isSelected,
        selected: shouldHaveSelectedClassName,
      })}
      key={id}
    >
      {/* Nav Item Row */}
      <NavItemRow
        depth={depth}
        item={item}
        toggleItemExpanded={toggleItemExpanded}
      />

      {/* Child Items */}
      {(expanded || depth >= 3) &&
        hasChildren && <ul>{renderChildItems(id, depth + 1)}</ul>}
    </li>
  );
};

NavItem.propTypes = {
  depth: PropTypes.number.isRequired,
  item: NavItemPropTypes,
  index: PropTypes.number.isRequired,
  renderChildItems: PropTypes.func.isRequired,
  sortedNavItems: PropTypes.arrayOf(NavItemPropTypes).isRequired,
  toggleItemExpanded: PropTypes.func.isRequired,
};

NavItem.defaultProps = {
  item: {},
  renderChildItems: () => {},
  sortedNavItems: [],
  toggleItemExpanded: () => {},
};

export default NavItem;
