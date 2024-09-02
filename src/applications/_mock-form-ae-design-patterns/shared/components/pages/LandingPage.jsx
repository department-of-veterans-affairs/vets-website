import React, { useEffect } from 'react';
import { handleEditPageDisplayTweaks } from '../../../App';

const defaultRootUrl = '/mock-form-ae-design-patterns';

const handleClick = (rootUrl, task) => {
  if (task === 'task-green') {
    window.location = `${rootUrl}/1/task-green/introduction?loggedIn=false`;
  }
  if (task === 'task-yellow') {
    window.location = `${rootUrl}/1/task-yellow/introduction?loggedIn=true`;
  }
  if (task === 'task-purple') {
    window.location = `${rootUrl}/1/task-purple/introduction?loggedIn=true`;
  }
};

export const LandingPage = ({ rootUrl }) => {
  return (
    <div className="vads-u-padding-bottom--7">
      <div className="vads-l-row">
        <div className="vads-l-col--12">
          <h1 className="vads-u-font-size--h1 vads-u-margin-top--4">
            User Research Study - Aug/Sep 2024
          </h1>
        </div>
      </div>

      <div className="vads-l-row vads-u-margin-y--2">
        <div className="vads-l-col">
          <button
            className="vads-u-width--full"
            onClick={() => handleClick(rootUrl || defaultRootUrl, 'task-green')}
            style={{
              backgroundColor: 'var(--vads-color-success-darker)',
            }}
          >
            Green Task
          </button>
        </div>
        <div className="vads-l-col">
          <p className="vads-u-margin-left--4">10-10EZR Form</p>
        </div>
      </div>
      <div className="vads-l-row vads-u-margin-y--2">
        <div className="vads-l-col">
          <button
            onClick={() =>
              handleClick(rootUrl || defaultRootUrl, 'task-yellow')
            }
            className="vads-u-color--black vads-u-border--2px vads-u-width--full"
            style={{
              backgroundColor: 'var(--vads-color-action-focus-on-light)',
            }}
          >
            Yellow Task
          </button>
        </div>
        <div className="vads-l-col">
          <p className="vads-u-margin-left--4">10-10EZR Form</p>
        </div>
      </div>

      <div className="vads-l-row vads-u-margin-y--2">
        <div className="vads-l-col">
          <button
            className="vads-u-width--full"
            onClick={() =>
              handleClick(rootUrl || defaultRootUrl, 'task-purple')
            }
            style={{ backgroundColor: 'var(--vads-color-link-visited)' }}
          >
            Purple Task
          </button>
        </div>

        <div className="vads-l-col">
          <p className="vads-u-margin-left--4">10182 Form</p>
        </div>
      </div>
    </div>
  );
};

//
export const LandingPageWrapper = ({ children }) => {
  useEffect(() => {
    handleEditPageDisplayTweaks(window.location);
  }, []);
  return children;
};
