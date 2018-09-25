import React from 'react';
import { connect } from 'react-redux';
import defaultLinkData from '../mega-menu-link-data.json';
import authorizedUserLinkData from '../mega-menu-link-data-for-authorized-users.json';
import { togglePanelOpen, toggleMobileDisplayHidden } from '../actions';
import { isLoggedIn } from '../../../user/selectors';

import MegaMenu from '@department-of-veterans-affairs/formation/MegaMenu';

// const SESSION_REFRESH_INTERVAL_MINUTES = 45;

export function flagCurrentPageInTopLevelLinks(links = [], pathName = window.location.pathname) {
  return links.map(link => {
    return pathName.endsWith(link.href) ? { ...link, currentPage: true } : link;
  });
}

export function maybeAddAuthorizedLinkData(loggedIn, authorizedLinks = authorizedUserLinkData, defaultLinks = defaultLinkData) {
  return [
    ...defaultLinks,
    ...loggedIn ? authorizedLinks : []
  ];
}

export class Main extends React.Component {
  render() {
    return (
      <MegaMenu {...this.props}></MegaMenu>
    );
  }
}

const mapStateToProps = (state) => {
  const data = flagCurrentPageInTopLevelLinks(maybeAddAuthorizedLinkData(isLoggedIn(state)));

  return {
    ...state.megaMenu,
    data
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleDisplayHidden: (hidden) => {
      dispatch(toggleMobileDisplayHidden(hidden));
    },
    toggleDropDown: (currentDropdown) => {
      dispatch(togglePanelOpen(currentDropdown));
    },
    updateCurrentSection: (currentSection) => {
      dispatch({
        type: 'UPDATE_CURRENT_SECTION',
        currentSection,
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
