import React from 'react';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';

import { createAnalyticsSlug } from '../utils/analytics';

const BackButton = props => {
  const { action, path } = props;

  const handleClick = e => {
    e.preventDefault();
    recordEvent({
      event: createAnalyticsSlug('back-button-clicked'),
      fromPage: path,
    });
    action();
  };
  return (
    <>
      <nav
        aria-label="Breadcrumb"
        aria-live="polite"
        className="va-nav-breadcrumbs va-nav-breadcrumbs--mobile"
      >
        <ul className="row va-nav-breadcrumbs-list columns">
          <li>
            <a onClick={e => handleClick(e)} href="#" data-testid="back-button">
              Back to last screen
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

BackButton.propTypes = {
  action: PropTypes.func,
  path: PropTypes.string,
};

export default BackButton;
