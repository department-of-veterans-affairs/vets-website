// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { get } from 'lodash';
// Relative
import DuplicateLineLabel from './DuplicateLineLabel';
import ExpandCollapseButton from './ExpandCollapseButton';
import LabelText from './LabelText';

const NavItem = ({
  depth,
  item,
  index,
  renderChildItems,
  sortedNavItems,
  toggleItemExpanded,
}) => {
  // Derive the item properties.
  const hasChildren = get(item, 'hasChildren');
  const expanded = get(item, 'expanded');
  const id = get(item, 'id');
  const isSelected = get(item, 'isSelected');
  const label = get(item, 'label', '');

  // Derive the depth booleans.
  const isFirstLevel = depth === 1;
  const isDeeperThanSecondLevel = depth >= 2;

  // Caclculate the indentation for the child items.
  const indentation = isDeeperThanSecondLevel ? 20 * (depth - 1) : 20;

  // Determine if we are the last nav item.
  const isLastNavItem = index === sortedNavItems.length - 1;

  return (
    <li className={`va-sidenav-level-${depth}`} key={id}>
      <a
        aria-label={label}
        className={classNames({
          'va-sidenav-item-label': true,
          selected: isSelected,
        })}
        onClick={toggleItemExpanded(id)}
        style={{ paddingLeft: indentation }}
      >
        {/* Label */}
        <LabelText item={item} />

        {/* Expand/Collapse Button */}
        <ExpandCollapseButton depth={depth} item={item} />
      </a>

      {/* Duplicate Line + Label when Expanded */}
      <DuplicateLineLabel depth={depth} item={item} />

      {/* Child Items */}
      {expanded && hasChildren && <ul>{renderChildItems(id, depth + 1)}</ul>}

      {/* Ending Line */}
      {isFirstLevel && !isLastNavItem && <div className="line" />}
    </li>
  );
};

export const NavItemPropType = PropTypes.shape({
  depth: PropTypes.number.isRequired,
  description: PropTypes.string,
  expanded: PropTypes.bool.isRequired,
  hasChildren: PropTypes.bool.isRequired,
  href: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  parentID: PropTypes.string,
  isSelected: PropTypes.bool.isRequired,
});

NavItem.propTypes = {
  depth: PropTypes.number.isRequired,
  item: NavItemPropType.isRequired,
  index: PropTypes.number.isRequired,
  renderChildItems: PropTypes.func.isRequired,
  sortedNavItems: PropTypes.arrayOf(NavItemPropType).isRequired,
  toggleItemExpanded: PropTypes.func.isRequired,
};

NavItem.defaultProps = {
  item: {},
  renderChildItems: () => {},
  sortedNavItems: [],
  toggleItemExpanded: () => {},
};

export default NavItem;
