// Node modules.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import MY_VA_LINK from '../constants/MY_VA_LINK';
import MegaMenu from '../components/MegaMenu';
import authenticatedUserLinkData from '../mega-menu-link-data-for-authenticated-users.json';
import recordEvent from '../../../monitoring/record-event';
import { isLoggedIn } from '../../../user/selectors';
import { replaceDomainsInData } from '../../../utilities/environment/stagingDomains';
import { selectShowDashboard2 } from 'applications/personalization/dashboard-2/selectors';
import {
  toggleMobileDisplayHidden,
  togglePanelOpen,
  updateCurrentSection,
} from '../actions';

export function flagCurrentPageInTopLevelLinks(
  links = [],
  href = window.location.href,
  pathName = window.location.pathname,
) {
  return links.map(
    link =>
      pathName.endsWith(link.href) || href === link.href
        ? { ...link, currentPage: true }
        : link,
  );
}

export function getAuthorizedLinkData(
  loggedIn,
  defaultLinks,
  authenticatedLinks = authenticatedUserLinkData,
) {
  return [
    ...(defaultLinks ? replaceDomainsInData(defaultLinks) : []),
    ...(loggedIn ? replaceDomainsInData(authenticatedLinks) : []),
  ];
}

export class Main extends Component {
  static propTypes = {
    megaMenuData: PropTypes.arrayOf(
      PropTypes.shape({
        href: PropTypes.string,
        menuSections: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
      }).isRequired,
    ).isRequired,
    toggleMobileDisplayHidden: PropTypes.func.isRequired,
    togglePanelOpen: PropTypes.func.isRequired,
    updateCurrentSection: PropTypes.func.isRequired,
    // From mapStateToProps.
    currentDropdown: PropTypes.string,
    currentSection: PropTypes.string,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        href: PropTypes.string,
        menuSections: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        title: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
    display: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
    showDashboard2: PropTypes.bool.isRequired,
  };

  toggleDropDown = currentDropdown => {
    const isVisible = !!currentDropdown;
    if (isVisible) {
      recordEvent({
        event: 'nav-header-top-level',
        'nav-header-action': `Navigation - Header - Open Top Level - ${currentDropdown}`,
      });
    }
    this.props.togglePanelOpen(currentDropdown);
  };

  updateCurrentSection = currentSection => {
    if (currentSection) {
      recordEvent({
        event: 'nav-header-second-level',
        'nav-header-action': `Navigation - Header - Open Second Level - ${currentSection}`,
      });
    }

    this.props.updateCurrentSection(currentSection);
  };

  linkClicked = link => {
    const linkName = link.text || link.title;
    recordEvent({
      event: 'nav-header-link',
      'nav-header-action': `Navigation - Header - Open Link - ${linkName}`,
    });
  };

  columnThreeLinkClicked = link => {
    recordEvent({
      event: 'nav-hub-containers',
      'nav-hub-action': link.text,
    });
  };

  toggleDisplayHidden = hidden => {
    this.props.toggleMobileDisplayHidden(hidden);
  };

  render() {
    const childProps = {
      ...this.props,
      toggleDisplayHidden: this.toggleDisplayHidden,
      toggleDropDown: this.toggleDropDown,
      updateCurrentSection: this.updateCurrentSection,
      linkClicked: this.linkClicked,
      columnThreeLinkClicked: this.columnThreeLinkClicked,
    };

    return <MegaMenu {...childProps} />;
  }
}

const mapStateToProps = (state, ownProps) => {
  const loggedIn = isLoggedIn(state);
  const showDashboard2 = selectShowDashboard2(state);

  // Derive the default mega menu links (both auth + unauth).
  const defaultLinks = [...ownProps.megaMenuData];

  // Add the My VA link to default links if we are showing dashboard 2 or if we are logged in.
  if (showDashboard2 || loggedIn) {
    defaultLinks.push(MY_VA_LINK);
  }

  const data = flagCurrentPageInTopLevelLinks(
    getAuthorizedLinkData(loggedIn, defaultLinks),
  );

  return {
    currentDropdown: state.megaMenu?.currentDropdown,
    currentSection: state.megaMenu?.currentSection,
    data,
    display: state.megaMenu?.display,
    loggedIn,
    showDashboard2,
  };
};

const mapDispatchToProps = {
  toggleMobileDisplayHidden,
  togglePanelOpen,
  updateCurrentSection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
