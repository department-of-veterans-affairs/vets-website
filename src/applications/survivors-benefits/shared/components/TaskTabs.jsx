import React from 'react';
import PropTypes from 'prop-types';

const getStylesForTab = tab => {
  return {
    backgroundColor: `var(${tab?.bgColor || '--vads-color-primary'})`,
    color: `var(${tab?.textColor || '--vads-color-white'})`,
  };
};

const getActiveTabClass = (activeTab, tab) => {
  const isActive = activeTab && activeTab.path === tab.path;
  return `${isActive ? 'vads-u-font-weight--bold' : ''}`;
};

const mangoConfig = {
  bgColor: '--vads-color-primary',
  textColor: '--vads-color-white',
};

const hatConfig = {
  bgColor: '--vads-color-secondary-dark',
  textColor: '--vads-color-white',
};

export const TaskTabs = ({ location, formConfig }) => {
  const tabs = [
    {
      name: 'Lemon',
      path: '/introduction?loggedIn=false',
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
  if (!tabs || tabs.length === 0) {
    return null;
  }

  const activeTab = tabs.find(
    tab => location.pathname.includes(tab.path) && tab.path !== '/',
  );

  const handleMangoClick = e => {
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
      // Construct full URL with /my-va?loggedIn=true
      window.location.href = `${
        window.location.protocol
      }//${newHostname}/my-va?loggedIn=true`;
    } else {
      // Regular localhost or other environments
      window.location.href = '/my-va?loggedIn=true';
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
        '-3001.app.github.dev',
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
            mangoConfig,
          )}`}
          style={getStylesForTab(mangoConfig)}
        >
          <a
            href="/my-va?loggedIn=true" // should be /my-va to use the My VA portal
            onClick={handleMangoClick}
            className="vads-u-color--white vads-u-text-decoration--none vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center vads-u-padding-y--1 vads-u-height--full vads-u-padding-x--5"
            style={getStylesForTab(mangoConfig)}
          >
            Mango
          </a>
        </li>
        <li
          className={`vads-u-text-align--center vads-u-margin-bottom--0 ${getActiveTabClass(
            activeTab,
            hatConfig,
          )}`}
          style={getStylesForTab(hatConfig)}
        >
          <a
            href="/"
            onClick={handleHatClick}
            className="vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center vads-u-padding-y--1 vads-u-height--full vads-u-padding-x--5"
            style={getStylesForTab(hatConfig)}
          >
            Hat
          </a>
        </li>
      </ul>
    </nav>
  );
};

TaskTabs.propTypes = {
  formConfig: PropTypes.shape({
    rootUrl: PropTypes.string.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
};
