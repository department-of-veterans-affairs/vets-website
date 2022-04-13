import React, { useCallback } from 'react';
import { withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';

import { createAnalyticsSlug } from '../utils/analytics';
import { useFormRouting } from '../hooks/useFormRouting';

import { URLS } from '../utils/navigation';

const BackToAppointments = ({ router, triggerRefresh }) => {
  const { jumpToPage } = useFormRouting(router);
  const { t } = useTranslation();
  const handleClick = useCallback(
    e => {
      e.preventDefault();
      recordEvent({
        event: createAnalyticsSlug('back-button-clicked'),
      });
      triggerRefresh();
      jumpToPage(URLS.DETAILS);
    },
    [jumpToPage, triggerRefresh],
  );
  return (
    <>
      <nav
        aria-live="polite"
        className="va-nav-breadcrumbs va-nav-breadcrumbs--mobile vads-u-margin-top--2 vads-u-padding-left--0"
      >
        <a
          onClick={handleClick}
          href="#appointments"
          data-testid="go-to-appointments-button"
        >
          {t('go-to-another-appointment')}
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
