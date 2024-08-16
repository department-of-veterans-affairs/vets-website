import React from 'react';

const defaultRootUrl = '/mock-form-ae-design-patterns';

const handleClick = (rootUrl, task) => {
  if (task === 'task-green') {
    window.location = `${rootUrl}/task-green/introduction?loggedIn=false`;
  }
  if (task === 'task-yellow') {
    window.location = `${rootUrl}/task-yellow/introduction?loggedIn=true`;
  }
  if (task === 'task-purple') {
    window.location = `${rootUrl}/task-purple/introduction?loggedIn=true`;
  }
};

export const NotFoundPage = ({ rootUrl }) => {
  return (
    <div className="vads-l-grid-container vads-u-padding-y--3 vads-u-padding-bottom--7">
      <div className="vads-l-row">
        <div className="vads-l-col--12">
          <h1 className="vads-u-font-size--h1 vads-u-margin-top--4">
            User Research Study - August 2024
          </h1>
        </div>
      </div>

      <div className="vads-l-row vads-u-margin-y--2">
        <button
          onClick={() => handleClick(rootUrl || defaultRootUrl, 'task-green')}
          style={{
            backgroundColor: 'var(--vads-color-success-darker)',
          }}
        >
          Green Task
        </button>

        <span className="vads-u-margin-left--2 vads-u-font-family--serif vads-u-font-size--h2 vads-u-padding-y--1">
          101-10EZR Form
        </span>
      </div>
      <div className="vads-l-row vads-u-margin-y--2">
        <button
          onClick={() => handleClick(rootUrl || defaultRootUrl, 'task-yellow')}
          className="vads-u-color--black vads-u-border--2px vads-u-border-color--base"
          style={{ backgroundColor: 'var(--vads-color-action-focus-on-light)' }}
        >
          Yellow Task
        </button>

        <span className="vads-u-margin-left--2 vads-u-font-family--serif vads-u-font-size--h2 vads-u-padding-y--1">
          101-10EZR Form
        </span>
      </div>

      <div className="vads-l-row vads-u-margin-y--2">
        <button
          onClick={() => handleClick(rootUrl || defaultRootUrl, 'task-purple')}
          style={{ backgroundColor: 'var(--vads-color-link-visited)' }}
        >
          Purple Task
        </button>

        <span className="vads-u-margin-left--2 vads-u-font-family--serif vads-u-font-size--h2 vads-u-padding-y--1">
          10182 Form
        </span>
      </div>
    </div>
  );
};
