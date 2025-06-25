import React from 'react';
import PropTypes from 'prop-types';

export const getStylesForTab = tab => {
  return {
    backgroundColor: `var(${tab?.bgColor || '--vads-color-primary'})`,
    color: `var(${tab?.textColor || '--vads-color-white'})`,
  };
};

const getActiveTabClass = (activeTab, tab) => {
  const isActive = activeTab && activeTab.path === tab.path;

  return `${isActive ? 'vads-u-font-weight--bold' : ''}`;
};

export const TaskTabs = ({ location, tabsConfig, rootUrl }) => {
  if (!tabsConfig) {
    return null;
  }

  const activeTab = tabsConfig.find(
    tab => location.pathname.includes(tab.path) && tab.path !== '/',
  );

  return (
    <nav aria-label="Research study task navigation">
      <ul
        className="nav-tabs vads-l-row vads-u-margin-y--0 vads-u-padding-left--0"
        style={{ listStyleType: 'none' }}
      >
        <li
          key="home"
          className="vads-u-text-align--center vads-u-margin-bottom--0 vads-u-background-color--primary vads-u-color--white"
        >
          <a
            href={rootUrl}
            className="vads-u-text-decoration--none vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center vads-u-padding-y--1 vads-u-height--full vads-u-background-color--primary vads-u-color--white"
          >
            Home
          </a>
        </li>
        {tabsConfig.map(tab => (
          <li
            key={tab.name}
            className={`vads-u-text-align--center vads-u-margin-bottom--0 ${getActiveTabClass(
              activeTab,
              tab,
            )}`}
            style={getStylesForTab(tab)}
          >
            <a
              href={`${rootUrl}${tab.path}`}
              className="vads-u-text-decoration--none vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center vads-u-padding-y--1 vads-u-height--full"
              style={getStylesForTab(tab)}
            >
              {tab.name}
            </a>
          </li>
        ))}
      </ul>
      <div style={{ height: '40px', ...getStylesForTab(activeTab) }} />
    </nav>
  );
};

// add prop types
TaskTabs.propTypes = {
  location: PropTypes.object.isRequired,
  rootUrl: PropTypes.string.isRequired,
  tabsConfig: PropTypes.array.isRequired,
};
