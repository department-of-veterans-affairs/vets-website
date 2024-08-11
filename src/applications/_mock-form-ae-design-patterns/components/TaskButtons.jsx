import React from 'react';

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

const defaultRootUrl = '/mock-form-ae-design-patterns';

export const TaskButtons = ({ rootUrl }) => {
  return (
    <div className="vads-l-grid-container vads-u-margin-y--4">
      <div className="vads-l-row">
        <div className="vads-l-col--12">
          <button
            onClick={() => handleClick(rootUrl || defaultRootUrl, 'task-green')}
          >
            Task Green
          </button>
          <button
            onClick={() =>
              handleClick(rootUrl || defaultRootUrl, 'task-yellow')
            }
          >
            Task Yellow
          </button>
          <button
            onClick={() =>
              handleClick(rootUrl || defaultRootUrl, 'task-purple')
            }
          >
            Task Purple
          </button>
        </div>
      </div>
    </div>
  );
};
