import React from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import authenticatedUserLinkData from '../mega-menu-link-data-for-authenticated-users.json';
import {
  togglePanelOpen,
  toggleMobileDisplayHidden,
  updateCurrentSection,
} from '../actions';
import { toggleMyHealthModal } from './../../user-nav/actions';
import recordEvent from '../../../monitoring/record-event';
import { selectProfile, isLoggedIn } from '../../../user/selectors';
import { replaceDomainsInData } from '../../../utilities/environment/stagingDomains';

import MegaMenu from '@department-of-veterans-affairs/formation-react/MegaMenu';

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
    ...replaceDomainsInData(defaultLinks),
    ...(loggedIn ? replaceDomainsInData(authenticatedLinks) : []),
  ];
}

export class Main extends React.Component {
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
    if (link.title === 'My Health') {
      this.handleMyHealthClick();
    }

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

  handleMyHealthClick = () => {
    const mhvLink = replaceDomainsInData([
      {
        title: 'My Health',
        href: 'https://www.myhealth.va.gov/mhv-portal-web/home',
        target: '_blank',
      },
    ])[0];
    const { mhvAccount } = this.props;

    const redirectToMhv = mhvAccount && mhvAccount.accountLevel !== null;

    // If user has valid mhvAccount, redirect instead of toggling modal
    if (redirectToMhv) {
      window.location = mhvLink.href;
    } else {
      this.props.toggleMyHealthModal(true);
    }
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

    return (
      <div>
        <MegaMenu {...childProps} />
      </div>
    );
  }
}

const mainSelector = createSelector(
  ({ state }) => selectProfile(state),
  ({ state }) => isLoggedIn(state),
  ({ state }) => state.megaMenu,
  ({ megaMenuData }) => megaMenuData,
  (profile, loggedIn, megaMenu, megaMenuData) => {
    const data = flagCurrentPageInTopLevelLinks(
      getAuthorizedLinkData(loggedIn, megaMenuData),
    );

    return {
      ...megaMenu,
      mhvAccount: profile.mhvAccount,
      data,
    };
  },
);

const mapStateToProps = (state, ownProps) =>
  mainSelector({
    state,
    megaMenuData: ownProps.megaMenuData,
  });

const mapDispatchToProps = {
  toggleMobileDisplayHidden,
  toggleMyHealthModal,
  togglePanelOpen,
  updateCurrentSection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
