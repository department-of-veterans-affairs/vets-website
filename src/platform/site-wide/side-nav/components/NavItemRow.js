// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// Relative
import { NavItemPropTypes } from '../prop-types';

const NavItemRow = ({ depth, item, toggleItemExpanded }) => {
  // Derive item properties.
  const { expanded, hasChildren, href, id, isSelected, label } = item;

  // Derive depth booleans.
  const isFirstLevel = depth === 1;
  const isDeeperThanSecondLevel = depth >= 2;

  // Calculate the indentation for the child items.
  const indentation = isDeeperThanSecondLevel ? 20 * (depth - 1) : 20;

  // Expanded not selected
  const isExpanded = expanded && depth === 2 && !isSelected;
  // Expanded beyond level 2 expanded and selected
  const moreThanLevel2SelectedExpanded = expanded && depth > 2 && isSelected;
  const isLevelFourOrDeeper = item.depth >= 4;
  if (isFirstLevel) {
    return (
      <h2
        className={classNames(
          'va-sidenav-item-label, vads-u-font-family--sans',
          {
            'va-sidenav-item-label-bold': isFirstLevel,
          },
        )}
        style={{
          paddingLeft: indentation,
          fontSize: '14px',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </h2>
    );
  }

  // Render the row not as a link when there are child nav items.
  if (hasChildren) {
    return (
      <a
        aria-current={isSelected ? 'page' : undefined}
        aria-label={label}
        className={classNames('va-sidenav-item-label', {
          'va-sidenav-item-label-bold': isFirstLevel,
          selected:
            !isExpanded && !moreThanLevel2SelectedExpanded && isSelected,
          expanded: !moreThanLevel2SelectedExpanded && isExpanded,
          open: moreThanLevel2SelectedExpanded,
        })}
        href={href}
        onClick={toggleItemExpanded(id)}
        rel="noopener noreferrer"
        style={{ paddingLeft: indentation }}
      >
        {/* Label text */}
        <span
          className={classNames({
            'grandchild-left-line': isLevelFourOrDeeper && !isSelected,
          })}
        >
          {' '}
          {label}{' '}
        </span>
      </a>
    );
  }

  return (
    <a
      aria-label={label}
      aria-current={isSelected ? 'page' : undefined}
      className={classNames('va-sidenav-item-label', {
        open: !!(depth >= 2 && isSelected),
      })}
      href={href}
      onClick={toggleItemExpanded(id)}
      rel="noopener noreferrer"
      style={{ paddingLeft: indentation }}
    >
      {/* Label text */}
      <span
        className={classNames({
          'grandchild-left-line': isLevelFourOrDeeper && !isSelected,
        })}
      >
        {' '}
        {label}{' '}
      </span>
    </a>
  );
};

NavItemRow.propTypes = {
  depth: PropTypes.number.isRequired,
  item: NavItemPropTypes,
  toggleItemExpanded: PropTypes.func.isRequired,
};

export default NavItemRow;
