import React from 'react';
import PropTypes from 'prop-types';
import { getStylesForTab } from '../../utils/helpers/tabs';

const getActiveTabClass = (activeTab, tab) => {
  const isActive = activeTab && activeTab.path === tab.path;
  return `${isActive ? 'vads-u-font-weight--bold' : ''}`;
};

const mittensConfig = {
  bgColor: '--vads-color-primary',
  textColor: '--vads-color-white',
};

const recordsConfig = {
  bgColor: '--vads-color-secondary-dark',
  textColor: '--vads-color-white',
};

export const TaskTabs = ({ location, formConfig }) => {
  const tabs = [
    {
      name: 'Umbrella',
      path: '/introduction?loggedIn=false',
      description: 'Umbrella',
      bgColor: '--vads-color-warning',
      textColor: '--vads-color-black',
    },
    {
      name: 'Apron',
      path: '/introduction?loggedIn=true',
      description: 'Apron',
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

  const handleTabClick = (e, tabPath) => {
    e.preventDefault();

    // Check if we're on a GitHub Codespace (github.dev URL)
    const isGitHubCodespace = window.location.hostname.includes(
      'app.github.dev',
    );

    if (isGitHubCodespace) {
      // In Codespaces, port is part of hostname (e.g., -3001.app.github.dev or -3002.app.github.dev)
      // Replace the port number in hostname with 3001
      const newHostname = window.location.hostname.replace(
        /-\d+\.app\.github\.dev$/,
        '-3001.app.github.dev',
      );
      // Construct full URL with the tab path
      const fullPath = `${formConfig.rootUrl}${tabPath}`;
      window.location.href = `${
        window.location.protocol
      }//${newHostname}${fullPath}`;
    } else {
      // Regular localhost or other environments
      window.location.href = `${formConfig.rootUrl}${tabPath}`;
    }
  };

  const handleHatClick = e => {
    e.preventDefault();

    // Check if we're on a GitHub Codespace (github.dev URL)
    const isGitHubCodespace = window.location.hostname.includes(
      'app.github.dev',
    );

    if (isGitHubCodespace) {
      // In Codespaces, port is part of hostname (e.g., -3001.app.github.dev or -3002.app.github.dev)
      // Replace the port number in hostname with 3002
      const newHostname = window.location.hostname.replace(
        /-\d+\.app\.github\.dev$/,
        '-3002.app.github.dev',
      );
      // Construct full URL with / path
      window.location.href = `${window.location.protocol}//${newHostname}/`;
    } else {
      // Regular localhost or other environments
      window.location.href = '/';
    }
  };

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
              onClick={e => handleTabClick(e, tab.path)}
              className="vads-u-text-decoration--none vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center vads-u-padding-y--1 vads-u-height--full vads-u-padding-x--5"
              style={getStylesForTab(tab)}
            >
              {tab.name}
            </a>
          </li>
        ))}
        <li
          className={`vads-u-text-align--center vads-u-margin-bottom--0 ${getActiveTabClass(
            activeTab,
            mittensConfig,
          )}`}
          style={getStylesForTab(mittensConfig)}
        >
          <a
            href="/my-va"
            className="vads-u-text-decoration--none vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center vads-u-padding-y--1 vads-u-height--full vads-u-padding-x--5"
            style={getStylesForTab(mittensConfig)}
          >
            Mittens
          </a>
        </li>
        <li
          className={`vads-u-text-align--center vads-u-margin-bottom--0 ${getActiveTabClass(
            activeTab,
            recordsConfig,
          )}`}
          style={getStylesForTab(recordsConfig)}
        >
          <a
            href="/"
            onClick={handleHatClick}
            className="vads-u-text-decoration--none vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center vads-u-padding-y--1 vads-u-height--full vads-u-padding-x--5"
            style={getStylesForTab(recordsConfig)}
          >
            Hat
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
