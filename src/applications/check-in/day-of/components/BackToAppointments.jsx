import React from 'react';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';

import { createAnalyticsSlug } from '../../utils/analytics';
import { goToNextPage, URLS } from '../utils/navigation';
import { withRouter } from 'react-router';

const BackToAppointments = ({ router, triggerRefresh }) => {
  const handleClick = e => {
    e.preventDefault();
    recordEvent({
      event: createAnalyticsSlug('back-button-clicked'),
    });
    triggerRefresh();
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

BackToAppointments.propTypes = {
  router: PropTypes.object,
  triggerRefresh: PropTypes.func,
};

export default withRouter(BackToAppointments);
