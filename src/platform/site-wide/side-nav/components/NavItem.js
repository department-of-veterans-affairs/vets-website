// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
// Relative
import NavItemRow from './NavItemRow';
import { NavItemPropTypes } from '../prop-types';

/*
 Detects expanded children to modify the ending line style
 with a short delay.
 This is looks a bit tricky but ending line will have to render always first
 for level 1 items and then because of the recursive way of rendering children
 after this we can detect that children has been expanded and apply
 the style by finding it by its parentID.
*/
const shouldModifyEndingLine = (item, depth) => {
  const expanded = get(item, 'expanded');
  const hasChildren = get(item, 'hasChildren');
  const shouldShowLineOpen = !!(depth === 2 && expanded && hasChildren);
  if (shouldShowLineOpen) {
    setTimeout(() => {
      const element = document.getElementById(`${item.parentID}-line`);
      if (element) {
        element.className = 'line-open';
      }
    }, 1);
  }
  return null;
};

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

      {/* Child Items */}
      {(expanded || depth >= 3) &&
        hasChildren && <ul>{renderChildItems(id, depth + 1)}</ul>}

      {/* Ending Line */}
      {isFirstLevel &&
        !isLastNavItem && <div id={`${item.id}-line`} className="line" />}
      {shouldModifyEndingLine(item, depth)}
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
