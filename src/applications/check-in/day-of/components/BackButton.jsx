import React from 'react';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';

import { createAnalyticsSlug } from '../../utils/analytics';

const BackButton = props => {
  const { router } = props;

  const handleClick = e => {
    e.preventDefault();
    const { goBack } = router;
    const path = router.location.pathname;

    recordEvent({
      event: createAnalyticsSlug('back-button-clicked'),
      fromPage: path,
    });
    goBack();
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
  router: PropTypes.object,
};

export default BackButton;
