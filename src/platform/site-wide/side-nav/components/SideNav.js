// Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import recordEvent from 'platform/monitoring/record-event';
import { find, filter, get, map, orderBy } from 'lodash';
// Relative
import debounce from 'platform/utilities/data/debounce';
import NavItem from './NavItem';

class SideNav extends Component {
  static propTypes = {
    navItemsLookup: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.debouncedResize = debounce(250, this.setIsDesktop);
    this.state = {
      active: false,
      isDesktop: this.getDesktop(), // adding this to trigger re-render on window resize
      navItemsLookup: props.navItemsLookup,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.debouncedResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedResize);
  }

  getDesktop = () => {
    return window.innerWidth > 768;
  };

  setIsDesktop = () => {
    this.setState({ isDesktop: this.getDesktop() });
  };

  trackEvents = id => {
    const { navItemsLookup } = this.state;

    // Derive the nav item and its properties.
    const navItem = get(navItemsLookup, `[${id}]`);
    const hasChildren = get(navItem, 'hasChildren');
    const depth = get(navItem, 'depth');
    const parentID = get(navItem, 'parentID');

    // Derive the parent item and its properties.
    const parentItem = get(navItemsLookup, `[${parentID}]`);
    const parentLabel = get(parentItem, 'label');

    // Determine if the nav item is top-level.
    const isTopNavItem = depth <= 1;

    // Escape early if the item is a top nav item.
    if (isTopNavItem) {
      return;
    }

    // Escape early if the item has children.
    if (hasChildren) {
      recordEvent({ event: 'nav-sidenav' });
      return;
    }

    // Track non-nested sidenav item click: https://github.com/department-of-veterans-affairs/va.gov-team/issues/7643
    if (depth === 2) {
      recordEvent({ event: 'nav-sidenav' });
      return;
    }

    // Track item with no children click.
    recordEvent({
      event: 'nav-sidenav-child',
      'sidenav-dropdown-header': parentLabel,
    });
  };

  toggleUlClass = () => {
    this.setState({ active: !this.state.active });
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
        trackEvents={this.trackEvents}
        navExpanded={this.state.isDesktop ? true : !!this.state.active}
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
      <div
        className={classNames(
          'medium-screen:vads-u-height--auto',
          'medium-screen:vads-u-margin-left--0',
          'large-screen:vads-u-margin-right--2p5',
          'medium-screen:vads-u-margin-y--0',
          'usa-width-one-fourth',
          'va-sidenav',
          'va-sidenav-wrapper',
          'vads-u-margin--1',
          {
            'va-sidenav-height': !!this.state.active,
          },
        )}
      >
        <button
          type="button"
          className={classNames(
            'medium-screen:vads-u-display--none',
            'va-sidenav-default-trigger',
            'vads-u-color--primary',
          )}
          onClick={this.toggleUlClass}
          id="sidenav-menu"
          aria-label="In this section menu"
          aria-controls="va-sidenav-ul-container"
          aria-expanded={this.state.active}
        >
          <span className="sr-only">View sub-navigation for </span>
          In this section
          <va-icon icon="menu" size="3" />
        </button>
        <ul
          id="va-sidenav-ul-container"
          className={classNames(
            'va-sidenav',
            'vads-u-margin-top--0',
            'vads-u-padding--0',
          )}
        >
          {/* Render all the items recursively. */}
          {renderChildItems(parentMostID, 1)}
        </ul>
      </div>
    );
  }
}

export default SideNav;
