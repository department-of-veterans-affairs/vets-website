import React, { useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import { createAnalyticsSlug } from '../utils/analytics';
import { useFormRouting } from '../hooks/useFormRouting';

import { URLS } from '../utils/navigation';

const BackToAppointments = () => {
  const history = useHistory();
  const { jumpToPage } = useFormRouting({ push: history.push });
  const { t } = useTranslation();
  const handleClick = useCallback(
    e => {
      e.preventDefault();
      recordEvent({
        event: createAnalyticsSlug('go-to-appointments-clicked', 'nav'),
      });
      jumpToPage(URLS.APPOINTMENTS);
    },
    [jumpToPage],
  );
  return (
    <>
      <nav
        aria-live="polite"
        className="va-nav-breadcrumbs va-nav-breadcrumbs--mobile vads-u-margin-top--2 vads-u-padding-left--0"
      >
        <Link
          onClick={handleClick}
          to={URLS.DETAILS}
          data-testid="go-to-appointments-button"
        >
          {t('back-to-todays-appointments')}
        </Link>
      </nav>
    </>
  );
};

BackToAppointments.propTypes = {};

export default BackToAppointments;
