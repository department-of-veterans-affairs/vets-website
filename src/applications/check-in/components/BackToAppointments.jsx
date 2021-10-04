import React from 'react';

import recordEvent from 'platform/monitoring/record-event';

import { createAnalyticsSlug } from '../utils/analytics';
import { goToNextPage, URLS } from '../utils/navigation';
import { withRouter } from 'react-router';

const BackToAppointments = ({ router }) => {
  const handleClick = e => {
    e.preventDefault();
    recordEvent({
      event: createAnalyticsSlug('back-button-clicked'),
    });
    goToNextPage(router, URLS.DETAILS);
  };
  return (
    <>
      <nav
        aria-live="polite"
        className="va-nav-breadcrumbs va-nav-breadcrumbs--mobile vads-u-margin-top--3"
      >
        <a
          onClick={e => handleClick(e)}
          href="#"
          data-testid="go-to-appointments-button"
        >
          Go to another appointment
        </a>
      </nav>
    </>
  );
};

export default withRouter(BackToAppointments);
