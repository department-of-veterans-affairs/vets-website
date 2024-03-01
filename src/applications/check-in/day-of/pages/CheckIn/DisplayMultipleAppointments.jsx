import React, { useEffect, useCallback, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { useTranslation, Trans } from 'react-i18next';
import { useGetCheckInData } from '../../../hooks/useGetCheckInData';
import { APP_NAMES } from '../../../utils/appConstants';
import BackButton from '../../../components/BackButton';
import AppointmentBlock from '../../../components/AppointmentBlock';
import { useFormRouting } from '../../../hooks/useFormRouting';
import { useUpdateError } from '../../../hooks/useUpdateError';
import { useStorage } from '../../../hooks/useStorage';
import { makeSelectFeatureToggles } from '../../../utils/selectors/feature-toggles';

import TravelWarningAlert from '../../../components/TravelWarningAlert';

import { createAnalyticsSlug } from '../../../utils/analytics';
import { intervalUntilNextAppointmentIneligibleForCheckin } from '../../../utils/appointment';

import { makeSelectCurrentContext } from '../../../selectors';

import Wrapper from '../../../components/layout/Wrapper';

const DisplayMultipleAppointments = props => {
  const { appointments, router } = props;
  const { t } = useTranslation();

  const { getCheckinComplete } = useStorage(APP_NAMES.CHECK_IN);

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const context = useSelector(selectCurrentContext);
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { isTravelReimbursementEnabled } = useSelector(selectFeatureToggles);
  const { shouldRefresh } = context;
  const { isLoading, checkInDataError, refreshCheckInData } = useGetCheckInData(
    {
      refreshNeeded: shouldRefresh,
      appointmentsOnly: true,
      app: APP_NAMES.CHECK_IN,
    },
  );

  const refreshTimer = useRef(null);
  const { updateError } = useUpdateError();

  useEffect(() => {
    const slug = `check-in-viewed-appointment-list-VAOS-design`;
    recordEvent({
      event: createAnalyticsSlug(slug, 'nav'),
    });
  }, []);

  useEffect(
    () => {
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
    },
    [appointments, checkInDataError, updateError, refreshCheckInData],
  );

  const handleClick = useCallback(
    () => {
      recordEvent({
        event: createAnalyticsSlug(
          'refresh-appointments-button-clicked',
          'nav',
        ),
      });

      refreshCheckInData();
      focusElement('h1');
    },
    [refreshCheckInData],
  );

  const { goToPreviousPage } = useFormRouting(router);

  if (isLoading) window.scrollTo(0, 0);

  return isLoading ? (
    <div>
      <va-loading-indicator
        message={t('loading-your-appointments-for-today')}
      />
    </div>
  ) : (
    <>
      {!getCheckinComplete(window) && (
        <BackButton
          router={router}
          action={goToPreviousPage}
          // @TODO make this a valid url somehow
          prevUrl="#back"
        />
      )}
      <Wrapper
        pageTitle={t('your-appointments')}
        classNames="appointment-check-in"
        eyebrow={t('check-in')}
        withBackButton
      >
        {!isTravelReimbursementEnabled && <TravelWarningAlert />}
        <AppointmentBlock
          router={router}
          appointments={appointments}
          page="details"
        />
        <p data-testid="update-text">
          <Trans
            i18nKey="latest-update"
            components={{ bold: <strong /> }}
            values={{ date: new Date() }}
          />
        </p>
        <div
          data-testid="refresh-link"
          className="vads-u-display--flex vads-u-align-itmes--stretch vads-u-flex-direction--column"
        >
          <va-button
            secondary
            uswds
            big
            onClick={handleClick}
            data-testid="refresh-appointments-button"
            text={t('refresh')}
          />
        </div>
      </Wrapper>
    </>
  );
};

DisplayMultipleAppointments.propTypes = {
  appointments: PropTypes.array,
  getMultipleAppointments: PropTypes.func,
  router: PropTypes.object,
  token: PropTypes.string,
};

export default DisplayMultipleAppointments;
