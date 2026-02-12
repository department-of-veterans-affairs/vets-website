import React from 'react';
import PropTypes from 'prop-types';
import { getStylesForTab } from '../../utils/helpers/tabs';

const getActiveTabClass = (activeTab, tab) => {
  const isActive = activeTab && activeTab.path === tab.path;
  return `${isActive ? 'vads-u-font-weight--bold' : ''}`;
};

const recordsConfig = {};

export const TaskTabs = ({ location, formConfig }) => {
  // get the pattern number from the URL
  const tabs = [
    {
      name: 'Lemon',
      path: '/introduction?loggedIn=false',
      description: 'Lemon',
      bgColor: '--vads-color-warning',
      textColor: '--vads-color-black',
    },
    {
      name: 'Apple',
      path: '/introduction?loggedIn=true',
      description: 'Apple',
      bgColor: '--vads-color-success-dark',
      textColor: '--vads-color-white',
    },
  ];

  // if there are no tabs for the current pattern/location, don't render the component
  if (!tabs) {
    return null;
  }

  const activeTab = tabs.find(
    tab => location.pathname.includes(tab.path) && tab.path !== '/',
  );

  return (
    <nav aria-label="Research study task navigation">
      <ul
        className="nav-tabs vads-l-row vads-u-margin-y--0 vads-u-padding-left--0 vads-u-margin-x--auto vads-u-justify-content--center vads-u-padding-y--2"
        style={{ listStyleType: 'none', backgroundColor: '#162e51' }}
      >
        {tabs.map(tab => (
          <li
            key={tab.name}
            className={`vads-u-text-align--center vads-u-margin-bottom--0 ${getActiveTabClass(
              activeTab,
              tab,
            )}`}
            style={getStylesForTab(tab)}
          >
            <a
              href={`${formConfig.rootUrl}${tab.path}`}
              className="vads-u-text-decoration--none vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center vads-u-padding-y--1 vads-u-height--full vads-u-padding-x--5"
            >
              {tab.name}
            </a>
          </li>
        ))}
        <li
          className={`vads-u-text-align--center vads-u-margin-bottom--0 ${getActiveTabClass(
            activeTab,
            recordsConfig,
          )}`}
          style={getStylesForTab(recordsConfig)}
        >
          <a
            href="/my-va"
            className="vads-u-color--white vads-u-text-decoration--none vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center vads-u-padding-y--1 vads-u-height--full vads-u-padding-x--5"
          >
            Mango
          </a>
        </li>
      </ul>
    </nav>
  );
};

// add prop types
TaskTabs.propTypes = {
  formConfig: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};
