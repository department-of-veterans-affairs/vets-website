import React from 'react';
import PropTypes from 'prop-types';
import { tabsConfig } from '../../utils/data/tabs';
import { getStylesForTab } from '../../utils/helpers/tabs';

const getActiveTabClass = (activeTab, tab) => {
  const isActive = activeTab && activeTab.path === tab.path;

  return `${isActive ? 'vads-u-font-weight--bold' : ''}`;
};

export const TaskTabs = ({ location, formConfig }) => {
  // get the pattern number from the URL
  const patternNumber = location.pathname.match(/^\/(\d+)\//)?.[1];
  const patternKey = `pattern${patternNumber}`;
  const tabs = tabsConfig?.[patternKey];

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
        className="nav-tabs vads-l-row vads-u-margin-y--0 vads-u-padding-left--0"
        style={{ listStyleType: 'none' }}
      >
        <li
          key="home"
          className="vads-u-text-align--center vads-u-margin-bottom--0 vads-u-background-color--primary vads-u-color--white"
        >
          <a
            href={`/mock-form-ae-design-patterns/${patternNumber}`}
            className="vads-u-text-decoration--none vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center vads-u-padding-y--1 vads-u-height--full vads-u-background-color--primary vads-u-color--white"
          >
            Home
          </a>
        </li>
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
  formConfig: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};
