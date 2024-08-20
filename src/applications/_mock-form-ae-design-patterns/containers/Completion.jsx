import React from 'react';
import { TaskButtons } from '../components/TaskButtons';

export const Completion = () => {
  return (
    <div className="vads-l-grid-container">
      <div className="vads-l-row">
        <div className="vads-l-col--12">
          <div className="usa-alert usa-alert-success" role="alert">
            <div className="usa-alert-body">
              <h3 className="usa-alert-heading">Congratulations!</h3>
              <p className="usa-alert-text">
                You have successfully completed the current task. Please await
                further instructions from the study organizer.
              </p>
            </div>
          </div>

          <h2 className="vads-u-font-size--h3 vads-u-margin-top--4">
            Available Tasks
          </h2>
          <p>Select a task to begin when instructed:</p>

          <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-top--2">
            <TaskButtons />
          </div>
        </div>
      </div>
    </div>
  );
};
