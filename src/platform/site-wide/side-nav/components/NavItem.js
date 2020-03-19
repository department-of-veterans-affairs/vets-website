// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
// Relative
import DuplicateLineLabel from './DuplicateLineLabel';
import NavItemRow from './NavItemRow';
import { NavItemPropTypes } from '../prop-types';

const NavItem = ({
  depth,
  item,
  index,
  renderChildItems,
  sortedNavItems,
  toggleItemExpanded,
}) => {
  // Derive the item properties.
  const expanded = get(item, 'expanded');
  const hasChildren = get(item, 'hasChildren');
  const id = get(item, 'id');

  // Derive the depth booleans.
  const isFirstLevel = depth === 1;

  // Determine if we are the last nav item.
  const isLastNavItem = index === sortedNavItems.length - 1;

  return (
    <li className={`va-sidenav-level-${depth}`} key={id}>
      {/* Nav Item Row */}
      <NavItemRow
        depth={depth}
        item={item}
        toggleItemExpanded={toggleItemExpanded}
      />

      {/* Duplicate Line + Label when Expanded */}
      <DuplicateLineLabel depth={depth} item={item} />

      {/* Child Items */}
      {expanded && hasChildren && <ul>{renderChildItems(id, depth + 1)}</ul>}

      {/* Ending Line */}
      {isFirstLevel && !isLastNavItem && <div className="line" />}
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
