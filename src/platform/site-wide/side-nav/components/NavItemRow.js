// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { get } from 'lodash';
// Relative
import ExpandCollapseIcon from './ExpandCollapseIcon';
import LabelText from './LabelText';
import { NavItemPropTypes } from '../prop-types';

const NavItemRow = ({ depth, item, toggleItemExpanded }) => {
  // Derive item properties.
  const hasChildren = get(item, 'hasChildren');
  const href = get(item, 'href');
  const id = get(item, 'id');
  const isSelected = get(item, 'isSelected');
  const label = get(item, 'label', '');

  // Derive depth booleans.
  const isFirstLevel = depth === 1;
  const isDeeperThanSecondLevel = depth >= 2;

  // Caclculate the indentation for the child items.
  const indentation = isDeeperThanSecondLevel ? 20 * (depth - 1) : 20;

  // Render the row not as a link when there are child nav items.
  if (hasChildren) {
    return (
      <button
        aria-label={label}
        className={classNames(
          'va-sidenav-item-label',
          'va-sidenav-item-label',
          'va-sidenav-item-label-underlined',
          {
            'va-sidenav-item-label-bold': isFirstLevel,
            selected: isSelected,
          },
        )}
        onClick={toggleItemExpanded(id)}
        style={{ paddingLeft: indentation }}
      >
        {/* Label */}
        <LabelText item={item} />

        {/* Expand/Collapse Button */}
        <ExpandCollapseIcon depth={depth} item={item} />
      </button>
    );
  }

  return (
    <a
      className={classNames(
        'va-sidenav-item-label',
        'va-sidenav-item-label',
        'va-sidenav-item-label-underlined',
        {
          selected: isSelected,
        },
      )}
      rel="noopener noreferrer"
      href={href}
      style={{ paddingLeft: indentation }}
    >
      {/* Label */}
      <LabelText item={item} />
    </a>
  );
};

NavItemRow.propTypes = {
  depth: PropTypes.number.isRequired,
  item: NavItemPropTypes,
  toggleItemExpanded: PropTypes.func.isRequired,
};

export default NavItemRow;
