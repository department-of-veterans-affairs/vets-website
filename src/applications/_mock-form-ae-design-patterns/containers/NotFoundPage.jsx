import React from 'react';
import { TaskButtons } from '../components/TaskButtons';

export const NotFoundPage = () => {
  return (
    <div className="vads-l-grid-container">
      <div className="vads-l-row">
        <div className="vads-l-col--12">
          <h1 className="vads-u-font-size--h1 vads-u-margin-top--4">
            Page not found
          </h1>
          <p className="vads-u-font-size--lg vads-u-margin-y--2">
            We’re sorry. The page you’re looking for can’t be found or doesn’t
            exist.
          </p>
          <ul className="usa-list vads-u-margin-y--3">
            <li>If you typed in the URL, check if it’s correct.</li>
            <li>
              If you pasted the URL, make sure you copied the entire address.
            </li>
          </ul>

          <h2>
            To get started with an Authenticated Pattern’s Task, use the buttons
            below:
          </h2>
          <TaskButtons />
        </div>
      </div>
    </div>
  );
};
