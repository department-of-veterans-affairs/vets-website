import React from 'react';
import PropTypes from 'prop-types';
import { isLoggedIn } from 'platform/user/selectors';
import { useSelector } from 'react-redux';

export const getStylesForTab = tab => {
  return {
    backgroundColor: `var(${tab?.bgColor || '--vads-color-primary'})`,
    color: `var(${tab?.textColor || '--vads-color-white'})`,
  };
};

const getActiveTabClass = (activeTab, tab) => {
  const isActive = activeTab && activeTab.path === tab?.path;

  return `${isActive ? 'vads-u-font-weight--bold' : ''}`;
};

export const TaskTabs = ({ location, tabsConfig, formConfig }) => {
  const loggedIn = useSelector(isLoggedIn);

  if (!tabsConfig) {
    return null;
  }

  const activeTab = tabsConfig.find(
    tab => location.pathname.includes(tab.path) && tab.path !== '/',
  );

  const handleClick = () => {
    if (loggedIn) {
      window.location.href = `${formConfig.rootUrl}${
        location.pathname
      }?loggedIn=false`;
    } else {
      window.location.href = `${formConfig.rootUrl}${
        location.pathname
      }?loggedIn=true`;
    }
  };

  return (
    <nav aria-label="Research study task navigation">
      <ul
        className="nav-tabs vads-l-row vads-u-margin-y--0 vads-u-padding-left--0 vads-u-margin-x--auto vads-u-justify-content--center vads-u-padding-y--2"
        style={{ listStyleType: 'none', backgroundColor: '#162e51' }}
      >
        <li
          className={`vads-u-text-align--center vads-u-margin-bottom--0 ${getActiveTabClass(
            activeTab,
          )}`}
          style={getStylesForTab()}
        >
          <a
            href={formConfig.rootUrl}
            className="vads-u-text-decoration--none vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center vads-u-padding-y--1 vads-u-height--full vads-u-padding-x--5"
            style={getStylesForTab()}
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
              href={`${formConfig.rootUrl}${tab.path}`}
              className="vads-u-text-decoration--none vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center vads-u-padding-y--1 vads-u-height--full vads-u-padding-x--5"
              style={getStylesForTab(tab)}
            >
              {tab.name}
            </a>
          </li>
        ))}
        <li>
          <va-button
            onClick={handleClick}
            text={loggedIn ? 'Sign Out' : 'Sign In'}
            class="vads-u-margin-left--2"
          />
        </li>
      </ul>
      <div style={{ height: '40px', ...getStylesForTab(activeTab) }} />
    </nav>
  );
};

// add prop types
TaskTabs.propTypes = {
  formConfig: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  tabsConfig: PropTypes.array.isRequired,
};
