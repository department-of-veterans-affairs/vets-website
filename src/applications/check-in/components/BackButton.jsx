import React from 'react';

import recordEvent from 'platform/monitoring/record-event';

import { createAnalyticsSlug } from '../utils/analytics';

export default function BackButton({ router }) {
  const handleClick = () => {
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
            <a onClick={handleClick} data-testid="back-button">
              Back to last screen
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
