import React from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';
import URLSearchParams from 'url-search-params';
import addMenuListeners from '../../accessible-menus';
import MenuSection from '../components/MenuSection';

import recordEvent from '../../../monitoring/record-event';

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
  render() {
    const data = [
      {
        title: 'Explore and Apply for Benefits',
        menuSections: [
          {
            title: 'Disabilty',
            links: [
              {
                text: 'Disability Benefits Overview',
                href: '/disability-benefits/',
              },
              {
                text: 'Eligibility',
                href: '/disability-benefits/eligibility/',
              },
              {
                text: 'Application Process',
                href: '/disability-benefits/apply/',
              },
              {
                text: 'Conditions',
                href: '/disability-benefits/conditions/',
              },
              {
                text: 'Track Your Claims and Appeals',
                href: '/track-claims/',
                className: 'login-required',
              },
              {
                text: 'Appeals Process',
                href: '/disability-benefits/claims-appeal/',
              },
              {
                text: 'Go to eBenefits to Apply include "assets/img/icons/exit-icon-white.svg"',
                href: 'https://www.ebenefits.va.gov/ebenefits/about/feature?feature=disability-compensation',
                className: 'usa-button va-button-primary va-external--light',
              },
            ]
          },
          {
            title: 'New Disabilty',
            links: [
              {
                text: 'Disability Benefits Overview',
                href: '/disability-benefits/',
              },
              {
                text: 'Eligibility',
                href: '/disability-benefits/eligibility/',
              },
              {
                text: 'Application Process',
                href: '/disability-benefits/apply/',
              },
              {
                text: 'Conditions',
                href: '/disability-benefits/conditions/',
              },
              {
                text: 'Track Your Claims and Appeals',
                href: '/track-claims/',
                className: 'login-required',
              },
              {
                text: 'Appeals Process',
                href: '/disability-benefits/claims-appeal/',
              },
              {
                text: 'Go to eBenefits to Apply include "assets/img/icons/exit-icon-white.svg"',
                href: 'https://www.ebenefits.va.gov/ebenefits/about/feature?feature=disability-compensation',
                className: 'usa-button va-button-primary va-external--light',
              },
            ]
          },
        ]
      },
      {
        title: 'Doing all the stuff',
        menuSections: [
          {
            title: 'Disabilty',
            links: [
              {
                text: 'Disability Benefits Overview',
                href: '/disability-benefits/',
              },
              {
                text: 'Eligibility',
                href: '/disability-benefits/eligibility/',
              },
              {
                text: 'Application Process',
                href: '/disability-benefits/apply/',
              },
              {
                text: 'Conditions',
                href: '/disability-benefits/conditions/',
              },
              {
                text: 'Track Your Claims and Appeals',
                href: '/track-claims/',
                className: 'login-required',
              },
              {
                text: 'Appeals Process',
                href: '/disability-benefits/claims-appeal/',
              },
              {
                text: 'Go to eBenefits to Apply include "assets/img/icons/exit-icon-white.svg"',
                href: 'https://www.ebenefits.va.gov/ebenefits/about/feature?feature=disability-compensation',
                className: 'usa-button va-button-primary va-external--light',
              },
            ]
          },
          {
            title: 'New Disabilty',
            links: [
              {
                text: 'Disability Benefits Overview',
                href: '/disability-benefits/',
              },
              {
                text: 'Eligibility',
                href: '/disability-benefits/eligibility/',
              },
              {
                text: 'Application Process',
                href: '/disability-benefits/apply/',
              },
              {
                text: 'Conditions',
                href: '/disability-benefits/conditions/',
              },
              {
                text: 'Track Your Claims and Appeals',
                href: '/track-claims/',
                className: 'login-required',
              },
              {
                text: 'Appeals Process',
                href: '/disability-benefits/claims-appeal/',
              },
              {
                text: 'Go to eBenefits to Apply include "assets/img/icons/exit-icon-white.svg"',
                href: 'https://www.ebenefits.va.gov/ebenefits/about/feature?feature=disability-compensation',
                className: 'usa-button va-button-primary va-external--light',
              },
            ]
          },
        ]
      }
    ];

    return (
      <div className="login-container">
        <div className="row va-flex">
          <div id="vetnav" role="navigation">
            <ul id="vetnav-menu" role="menubar">
              <li><a href="/" className="vetnav-level1" role="menuitem">Home</a></li>

              {
                data.map((item, i) => (
                  <MainDropDown
                    key={i + 'stuff'}
                    title={item.title}>
                    {
                      item.menuSections.map((section, i) => (
                        <MenuSection
                          key={section + i}
                          title={section.title}>
                          {
                            section.links.map((link, i) => (
                              <li key={i}><a {...link}>{link.text}</a></li>
                            ))
                          }
                        </MenuSection>
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
