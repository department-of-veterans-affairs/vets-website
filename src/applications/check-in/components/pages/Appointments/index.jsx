import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation, Trans } from 'react-i18next';

import { useGetCheckInData } from '../../../hooks/useGetCheckInData';
import Wrapper from '../../layout/Wrapper';
import { APP_NAMES } from '../../../utils/appConstants';
import { makeSelectApp, makeSelectVeteranData } from '../../../selectors';
import { useUpdateError } from '../../../hooks/useUpdateError';
import UpcomingAppointments from '../../UpcomingAppointments';
import ActionItemDisplay from '../../ActionItemDisplay';
import ExternalLink from '../../ExternalLink';

import { intervalUntilNextAppointmentIneligibleForCheckin } from '../../../utils/appointment';

const AppointmentsPage = props => {
  const { router } = props;
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { t } = useTranslation();
  const { updateError } = useUpdateError();
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);
  const [loadedAppointments, setLoadedAppointments] = useState(appointments);
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const {
    isComplete,
    isLoading: isDataLoading,
    checkInDataError,
    refreshCheckInData,
  } = useGetCheckInData({
    refreshNeeded: false,
    router,
    app,
  });

  const refreshTimer = useRef(null);

  useEffect(
    () => {
      setIsLoading(!isComplete);
      if (!loadedAppointments.length && !isComplete && !isDataLoading) {
        refreshCheckInData();
      } else if (loadedAppointments.length) {
        setIsLoading(false);
      }
    },
    [isComplete, isDataLoading, refreshCheckInData, loadedAppointments],
  );

  useEffect(
    () => {
      if (checkInDataError) {
        updateError(
          `error-fromlocation-${
            app === APP_NAMES.PRE_CHECK_IN ? 'precheckin' : 'dayof'
          }-appointments`,
        );
      }
    },
    [checkInDataError, updateError, app],
  );

  useEffect(
    () => {
      if (refresh) {
        refreshCheckInData();
        setLoadedAppointments([]);
        setRefresh(false);
      }
    },
    [refresh, refreshCheckInData],
  );

  useEffect(
    () => {
      if (app === APP_NAMES.CHECK_IN) {
        const refreshInterval = intervalUntilNextAppointmentIneligibleForCheckin(
          appointments,
        );

        // Refresh the page 5 seconds before the checkIn window expires.
        if (refreshInterval > 5000) {
          if (refreshTimer.current !== null) {
            clearTimeout(refreshTimer.current);
          }

          refreshTimer.current = setTimeout(
            () => refreshCheckInData(),
            refreshInterval - 5000,
          );
        }

        if (checkInDataError) {
          updateError('cant-retrieve-check-in-data');
        }
      }
    },
    [appointments, checkInDataError, updateError, refreshCheckInData, app],
  );

  if (isLoading) {
    window.scrollTo(0, 0);
    return (
      <div>
        <va-loading-indicator
          data-testid="loading-indicator"
          message={t('loading-your-appointment-information')}
        />
      </div>
    );
  }

  const accordionContent = [
    {
      header: t('what-to-do-if-you-cant-find-your-appointments'),
      body: (
        <>
          <p>
            {t('our-online-check-in-tool-doesnt-include-all--accordion-item')}
          </p>
          <p>
            <ExternalLink
              href="https://www.va.gov/my-health/appointments/"
              hrefLang="en"
            >
              {t('go-to-all-your-va-appointments')}
            </ExternalLink>
          </p>
        </>
      ),
      open: false,
    },
    {
      header: t('will-va-protect-my-personal-health-information'),
      body: (
        <>
          <p>
            {t(
              'we-make-every-effort-to-keep-your-personal-information-private-and-secure',
            )}
          </p>
          <p>
            <ExternalLink href="/privacy-policy/" hrefLang="en">
              {t('read-more-about-privacy-and-security-on-va-gov')}
            </ExternalLink>
          </p>
          <p>
            {t(
              'youre-also-responsible-for-protecting-your-personal-health-information',
            )}
          </p>
          <p>
            <ExternalLink
              href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/protecting-your-personal-health-information"
              hrefLang="en"
            >
              {t('get-tips-for-protecting-your-personal-health-information')}
            </ExternalLink>
          </p>
        </>
      ),
    },
  ];

  return (
    <Wrapper
      pageTitle={t('#-util-capitalize', { value: t('appointments') })}
      withBackButton
    >
      <ActionItemDisplay router={router} />
      <UpcomingAppointments router={router} refresh={refresh} />
      <div className="vads-u-display--flex vads-u-align-itmes--stretch vads-u-flex-direction--column vads-u-padding-top--1p5 vads-u-padding-bottom--5">
        <p data-testid="update-text">
          <Trans
            i18nKey="latest-update"
            components={{ bold: <strong /> }}
            values={{ date: new Date() }}
          />
        </p>
        <va-button
          uswds
          text={t('refresh')}
          big
          onClick={() => setRefresh(true)}
          secondary
          data-testid="refresh-appointments-button"
        />
      </div>
      <va-accordion uswds bordered data-testid="appointments-accordions">
        {accordionContent.map((accordion, index) => (
          <va-accordion-item
            key={index}
            header={accordion.header}
            open={accordion.open}
            uswds
            bordered
          >
            {accordion.body}
          </va-accordion-item>
        ))}
      </va-accordion>
    </Wrapper>
  );
};

AppointmentsPage.propTypes = {
  router: PropTypes.object,
};

export default AppointmentsPage;