import React, { useCallback } from 'react';
import { withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';

import { createAnalyticsSlug } from '../utils/analytics';
import { useFormRouting } from '../hooks/useFormRouting';

import { URLS } from '../utils/navigation';

const BackToAppointments = ({ router }) => {
  const { jumpToPage } = useFormRouting(router);
  const { t } = useTranslation();
  const handleClick = useCallback(
    e => {
      e.preventDefault();
      recordEvent({
        event: createAnalyticsSlug('go-to-appointments-clicked', 'nav'),
      });
      jumpToPage(URLS.DETAILS);
    },
    [jumpToPage],
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
          {t('back-to-todays-appointments')}
        </a>
      </nav>
    </>
  );
};

BackToAppointments.propTypes = {
  router: PropTypes.object,
};

export default withRouter(BackToAppointments);
