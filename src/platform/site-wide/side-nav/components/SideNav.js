// Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { find, filter, get, map, orderBy } from 'lodash';
// Relative
import NavItem from './NavItem';

class SideNav extends Component {
  static propTypes = {
    navItemsLookup: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      navItemsLookup: props.navItemsLookup,
    };
  }

  toggleItemExpanded = id => () => {
    const { navItemsLookup } = this.state;

    // Derive the nav item and its properties.
    const navItem = get(navItemsLookup, `[${id}]`);
    const hasChildren = get(navItem, 'hasChildren');
    const expanded = get(navItem, 'expanded');
    const depth = get(navItem, 'depth');

    // Determine if the nav item is top-level.
    const isTopNavItem = depth < 2;

    // Escape early if the item has no children or is not collapsible.
    if (!hasChildren || isTopNavItem) {
      return;
    }

    // Flip the item's expanded property.
    this.setState({
      navItemsLookup: {
        ...navItemsLookup,
        [id]: {
          ...navItemsLookup[id],
          expanded: !expanded,
        },
      },
    });
  };

  renderChildItems = (parentID, depth) => {
    const { navItemsLookup } = this.state;

    // Derive the items to render.
    const filteredNavItems = filter(
      navItemsLookup,
      item => item.parentID === parentID,
    );

    // Sort the items by `order`.
    const sortedNavItems = orderBy(filteredNavItems, 'order', 'asc');

    return map(sortedNavItems, (item, index) => (
      <NavItem
        depth={depth}
        index={index}
        item={item}
        key={get(item, 'id')}
        renderChildItems={this.renderChildItems}
        sortedNavItems={sortedNavItems}
        toggleItemExpanded={this.toggleItemExpanded}
      />
    ));
  };

  render() {
    const { renderChildItems } = this;
    const { navItemsLookup } = this.props;

    // Derive the parent-most nav item. This is O(n), which isn't great but I'm assuming there won't be 1000s of side nav items.
    const parentMostNavItem = find(navItemsLookup, item => !item.parentID);
    const parentMostID = get(parentMostNavItem, 'id');

    // Escape early if we have no nav items to render.
    if (!parentMostID) {
      return null;
    }

    return (
      <ul className="usa-width-one-fourth va-sidenav">
        {/* Render all the items recursively. */}
        {renderChildItems(parentMostID, 1)}
      </ul>
    );
  }
}

export default SideNav;
