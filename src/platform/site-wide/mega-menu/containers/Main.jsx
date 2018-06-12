import React from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';
import URLSearchParams from 'url-search-params';
import addMenuListeners from '../../accessible-menus';
import MenuSection from '../components/MenuSection';

import recordEvent from '../../../monitoring/record-event';
import data from '../data.json';

import MainDropDown from '../components/MainDropDown';
import {
  isLoggedIn,
  isProfileLoading,
  isLOA3
} from '../../../user/selectors';
import { getProfile } from '../../../user/profile/actions';
import { updateLoggedInStatus } from '../../../user/authentication/actions';

import {
  toggleLoginModal,
  toggleSearchHelpUserMenu
} from '../../../site-wide/user-nav/actions';

import { selectUserGreeting } from '../selectors';

// const SESSION_REFRESH_INTERVAL_MINUTES = 45;

export class Main extends React.Component {
  constructor() {
    super();

    this.state = {
      currentSection: 'Health Care',
    };

    this.updateCurrentSection = this.updateCurrentSection.bind(this);
  }

  updateCurrentSection(currentSection) {
    this.setState({ currentSection });
  }

  render() {
    return (
      <div className="login-container">
        <div className="row va-flex">
          <div id="vetnav" role="navigation">
            <ul id="vetnav-menu" role="menubar">
              <li><a href="/" className="vetnav-level1" role="menuitem">Home</a></li>
              {
                data.map((item, i) => (
                  <MainDropDown
                    {...this.state}
                    key={i + 'stuff'}
                    title={item.title}>
                    {
                      item.menuSections.map((section, i) => (
                        <MenuSection
                          {...this.state}
                          key={section + i}
                          title={section.title}
                          updateCurrentSection={this.updateCurrentSection}
                          links={section.links}></MenuSection>
                      ))
                    }
                  </MainDropDown>
                ))
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentlyLoggedIn: isLoggedIn(state),
    isProfileLoading: isProfileLoading(state),
    isLOA3: isLOA3(state),
    userGreeting: selectUserGreeting(state),
    ...state.navigation
  };
};

const mapDispatchToProps = {
  toggleLoginModal,
  toggleSearchHelpUserMenu,
  updateLoggedInStatus,
  getProfile
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
