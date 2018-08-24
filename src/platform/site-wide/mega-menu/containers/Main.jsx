import React from 'react';
import { connect } from 'react-redux';
import data from '../data.json';
import { togglePanelOpen, toggleMobileDisplayHidden } from '../actions';

import MegaMenu from '@department-of-veterans-affairs/formation/MegaMenu';

// const SESSION_REFRESH_INTERVAL_MINUTES = 45;

export class Main extends React.Component {
  render() {
    return (
      <MegaMenu {...this.props} data={data}></MegaMenu>
    );
  }
}

const mapStateToProps = ({ megaMenu }) => ({ ...megaMenu });

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
