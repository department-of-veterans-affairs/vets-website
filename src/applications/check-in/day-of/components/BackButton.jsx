import React from 'react';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';

import { createAnalyticsSlug } from '../../utils/analytics';
import { URLS } from '../../utils/navigation/day-of';

import { useFormRouting } from '../../hooks/useFormRouting';

const BackButton = props => {
  const { router, customAction } = props;
  const { goToPreviousPage } = useFormRouting(router, URLS);

  const handleClick = e => {
    e.preventDefault();

    const path = router.location.pathname;

    recordEvent({
      event: createAnalyticsSlug('back-button-clicked'),
      fromPage: path,
    });
    if (customAction) {
      customAction();
    } else {
      goToPreviousPage();
    }
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
  customAction: PropTypes.func,
};

export default BackButton;
