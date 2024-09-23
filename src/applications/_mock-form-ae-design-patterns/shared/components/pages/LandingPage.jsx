import React, { useEffect } from 'react';
import { handleEditPageDisplayTweaks } from '../../../App';
import { getStylesForTab } from '../../../utils/helpers/tabs';

const defaultRootUrl = '/mock-form-ae-design-patterns';

const handleClick = (rootUrl, path) => {
  window.location = `${rootUrl}${path}`;
};

export const LandingPage = ({
  rootUrl = defaultRootUrl,
  location,
  getTabs,
  getPatterns,
}) => {
  const tabs = getTabs(location);
  const month = new Date().toLocaleString('default', { month: 'long' });
  const year = new Date().getFullYear();

  return (
    <div className="vads-u-padding-bottom--7">
      <div className="vads-l-row">
        <div className="vads-l-col--12">
          <h1 className="vads-u-font-size--h1 vads-u-margin-top--4">
            User Research Study - {month} {year}
          </h1>
        </div>
      </div>

      {tabs.length > 0 ? (
        tabs.map(tab => (
          <div className="vads-l-row vads-u-margin-y--2" key={tab.name}>
            <div className="vads-l-col">
              <button
                className="vads-u-width--full"
                onClick={() => handleClick(rootUrl, tab.path)}
                style={getStylesForTab(tab)}
              >
                {tab.name}
              </button>
            </div>
            <div className="vads-l-col">
              <p className="vads-u-margin-left--4">{tab.description}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="vads-l-row">
          <div className="vads-l-col">
            {getPatterns().map(pattern => (
              <button
                key={pattern}
                className="vads-u-width--full vads-u-margin-y--1"
                onClick={() => handleClick(rootUrl, `/${pattern}`)}
              >
                Pattern {pattern}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const LandingPageWrapper = ({ children }) => {
  useEffect(() => {
    handleEditPageDisplayTweaks(window.location);
  }, []);
  return children;
};
