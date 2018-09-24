import React from 'react';
import { connect } from 'react-redux';
import defaultLinkData from '../mega-menu-link-data.json';
import authenticatedUserLinkData from '../mega-menu-link-data-for-authenticated-users.json';
import { togglePanelOpen, toggleMobileDisplayHidden } from '../actions';
import { isLoggedIn } from '../../../user/selectors';

import MegaMenu from '@department-of-veterans-affairs/formation/MegaMenu';

// const SESSION_REFRESH_INTERVAL_MINUTES = 45;
//               {window.location.pathname.endsWith('eligibility/') && <p><a href={applyLink}>Learn more about how to apply</a>.</p>}


export class Main extends React.Component {
  render() {
    return (
      <MegaMenu {...this.props}></MegaMenu>
    );
  }
}

const mapStateToProps = (state) => {
  const data = [
    ...defaultLinkData,
    ...isLoggedIn(state) ? authenticatedUserLinkData : []
  ];

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
