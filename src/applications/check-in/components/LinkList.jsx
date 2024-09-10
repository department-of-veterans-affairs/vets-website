import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import { makeSelectFeatureToggles } from '../utils/selectors/feature-toggles';
import { makeSelectApp } from '../selectors';

import { createAnalyticsSlug } from '../utils/analytics';
import { useFormRouting } from '../hooks/useFormRouting';

import { APP_NAMES } from '../utils/appConstants';
import { URLS } from '../utils/navigation';
import ExternalLink from './ExternalLink';

const LinkList = ({ router }) => {
  const { jumpToPage, getCurrentPageFromRouter } = useFormRouting(router);
  const page = getCurrentPageFromRouter();
  const { t } = useTranslation();
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const featureToggles = useSelector(selectFeatureToggles);
  const { isUpcomingAppointmentsEnabled } = featureToggles;

  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);

  const handleClick = (e, location) => {
    e.preventDefault();
    recordEvent({
      event: createAnalyticsSlug(`go-to-${location}-clicked`, 'nav'),
    });
    jumpToPage(location);
  };

  // appt link will be /my-health/appointments if toggle is on
  const apptLink = useToggleValue(
    TOGGLE_NAMES.vaOnlineSchedulingBreadcrumbUrlUpdate,
  )
    ? 'https://va.gov/my-health/appointments/'
    : 'https://va.gov/health-care/schedule-view-va-appointments/appointments/';

  const AppointmentsLink = () => {
    let linkText = t('review-todays-appointments');
    let testId = 'go-to-appointments-link';

    if (app === APP_NAMES.PRE_CHECK_IN) {
      linkText = t('review-your-appointments');
      testId = 'go-to-appointments-link-pre-check-in';
    }
    return (
      <Link
        onClick={e => handleClick(e, URLS.APPOINTMENTS)}
        to={URLS.APPOINTMENTS}
        data-testid={testId}
      >
        {linkText}
      </Link>
    );
  };
  const UpcomingAppointmentsLink = () => {
    return (
      <Link
        onClick={e => handleClick(e, URLS.UPCOMING_APPOINTMENTS)}
        to={URLS.UPCOMING_APPOINTMENTS}
        data-testid={`go-to-${URLS.UPCOMING_APPOINTMENTS}-link`}
      >
        {t('review-your-upcoming-appointments')}
      </Link>
    );
  };

  let body = null;
  if (page === URLS.APPOINTMENTS) {
    body = (
      <p data-testid="link-wrapper" className="vads-u-margin-bottom--4">
        <UpcomingAppointmentsLink />
      </p>
    );
  }
  if (page === URLS.UPCOMING_APPOINTMENTS) {
    body = (
      <p data-testid="link-wrapper" className="vads-u-margin-bottom--4">
        <AppointmentsLink />
      </p>
    );
  }
  if (page.includes(URLS.COMPLETE)) {
    body = (
      <>
        {isUpcomingAppointmentsEnabled && (
          <>
            {app === APP_NAMES.CHECK_IN && (
              <p data-testid="link-wrapper" className="vads-u-margin-bottom--2">
                <UpcomingAppointmentsLink />
              </p>
            )}
            <p data-testid="link-wrapper" className="vads-u-margin-bottom--2">
              <AppointmentsLink />
            </p>
          </>
        )}
        <p data-testid="link-wrapper" className="vads-u-margin-bottom--4">
          <ExternalLink href={apptLink} hrefLang="en">
            {t('sign-in-to-vagov-and-schedule')}
          </ExternalLink>
        </p>
      </>
    );
  }

  return (
    <>
      <nav aria-live="polite" data-testid="link-list-block">
        <h2 className="highlight vads-u-font-size--h4 vads-u-margin-top--8">
          {t('manage-your-appointments')}
        </h2>
        {body}
      </nav>
    </>
  );
};

LinkList.propTypes = {
  router: PropTypes.object,
};

export default withRouter(LinkList);
