import React from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import defaultLinkData from '../mega-menu-link-data.json';
import authenticatedUserLinkData from '../mega-menu-link-data-for-authenticated-users.json';
import { togglePanelOpen, toggleMobileDisplayHidden, updateCurrentSection } from '../actions';
import { isLoggedIn } from '../../../user/selectors';
import { replaceDomainsInData } from '../../../utilities/environment/stagingDomains';

import MegaMenu from '@department-of-veterans-affairs/formation/MegaMenu';

// const SESSION_REFRESH_INTERVAL_MINUTES = 45;

export function flagCurrentPageInTopLevelLinks(links = [], pathName = window.location.pathname) {
  return links.map(link => {
    return pathName.endsWith(link.href) ? { ...link, currentPage: true } : link;
  });
}

export function getAuthorizedLinkData(
  loggedIn,
  authenticatedLinks = authenticatedUserLinkData,
  defaultLinks = defaultLinkData
) {
  return [
    ...replaceDomainsInData(defaultLinks),
    ...loggedIn ? replaceDomainsInData(authenticatedLinks) : []
  ];
}

export class Main extends React.Component {
  render() {
    return (
      <MegaMenu {...this.props}></MegaMenu>
    );
  }
}

const mapStateToProps = createSelector(
  isLoggedIn,
  state => state.megaMenu,
  (loggedIn, megaMenu) => {
    const data = flagCurrentPageInTopLevelLinks(getAuthorizedLinkData(loggedIn));

    return {
      ...megaMenu,
      data
    };
  }
);

const mapDispatchToProps = {
  toggleDisplayHidden: toggleMobileDisplayHidden,
  toggleDropDown: togglePanelOpen,
  updateCurrentSection
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
