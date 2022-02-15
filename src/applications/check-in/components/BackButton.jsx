import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';

import { createAnalyticsSlug } from '../utils/analytics';
import { useFormRouting } from '../hooks/useFormRouting';
import { URLS } from '../utils/navigation';

const BackButton = props => {
  const { action, router } = props;
  const {
    getCurrentPageFromRouter,
    getPreviousPageFromRouter,
  } = useFormRouting(router);

  const currentPage = getCurrentPageFromRouter();
  const previousPage = getPreviousPageFromRouter();

  const handleClick = useCallback(
    e => {
      e.preventDefault();
      recordEvent({
        event: createAnalyticsSlug('back-button-clicked'),
        fromPage: currentPage,
      });
      action();
    },
    [currentPage, action],
  );

  if (previousPage && previousPage === URLS.LOADING) {
    return '';
  }
  return (
    <>
      <nav
        aria-label="Breadcrumb"
        aria-live="polite"
        className="va-nav-breadcrumbs va-nav-breadcrumbs--mobile"
      >
        <ul className="row va-nav-breadcrumbs-list columns">
          <li>
            <a onClick={handleClick} href="#back" data-testid="back-button">
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
  router: PropTypes.object,
};

export default BackButton;
