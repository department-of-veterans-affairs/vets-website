import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { createAnalyticsSlug } from '../../../utils/analytics';

import { makeSelectFeatureToggles } from '../../../utils/selectors/feature-toggles';
import BackToAppointments from '../../../components/BackToAppointments';
import TravelPayReimbursementLink from '../../../components/TravelPayReimbursementLink';
import Wrapper from '../../../components/layout/Wrapper';
import useSendTravelPayClaim from '../../../hooks/useSendTravelPayClaim';
import ExternalLink from '../../../components/ExternalLink';
import TravelPayAlert from './TravelPayAlert';
import { useStorage } from '../../../hooks/useStorage';
import { useFormRouting } from '../../../hooks/useFormRouting';
import AppointmentListItem from '../../../components/AppointmentDisplay/AppointmentListItem';
import { getAppointmentId } from '../../../utils/appointment';
import { useGetCheckInData } from '../../../hooks/useGetCheckInData';
import { useUpdateError } from '../../../hooks/useUpdateError';
import { APP_NAMES } from '../../../utils/appConstants';

const CheckInConfirmation = props => {
  const { appointments, selectedAppointment, triggerRefresh, router } = props;
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const featureToggles = useSelector(selectFeatureToggles);
  const { isTravelReimbursementEnabled } = featureToggles;
  const {
    isLoading: isCheckInDataLoading,
    checkInDataError,
    refreshCheckInData,
    isComplete,
  } = useGetCheckInData({
    refreshNeeded: false,
    appointmentsOnly: true,
    isPreCheckIn: false,
  });
  const { updateError } = useUpdateError();
  const { t } = useTranslation();
  const { jumpToPage } = useFormRouting(router);
  const appointment = selectedAppointment;

  const {
    travelPayEligible,
    travelPayClaimError,
    travelPayClaimRequested,
    travelPayClaimSent,
  } = useSendTravelPayClaim(appointment);

  useEffect(
    () => {
      scrollToTop('topScrollElement');
      triggerRefresh();
    },
    [triggerRefresh],
  );

  const {
    setShouldSendTravelPayClaim,
    getShouldSendTravelPayClaim,
  } = useStorage(false);

  const { setTravelPaySent, getTravelPaySent } = useStorage(false, true);

  useEffect(
    () => {
      if (travelPayClaimSent) {
        const { stationNo } = selectedAppointment;
        const travelPaySent = getTravelPaySent(window);
        travelPaySent[stationNo] = new Date();
        setShouldSendTravelPayClaim(window, false);
        setTravelPaySent(window, travelPaySent);
      }
    },
    [
      travelPayClaimSent,
      setShouldSendTravelPayClaim,
      setTravelPaySent,
      getTravelPaySent,
      selectedAppointment,
    ],
  );

  const doTravelPay = isTravelReimbursementEnabled && travelPayClaimRequested;

  const handleDetailClick = e => {
    e.preventDefault();
    recordEvent({
      event: createAnalyticsSlug('details-link-clicked', 'nav'),
    });

    refreshCheckInData();
  };

  useEffect(
    () => {
      if (isComplete) {
        jumpToPage(`appointment-details/${getAppointmentId(appointment)}`);
      }
    },
    [isComplete, jumpToPage, appointment],
  );
  useEffect(
    () => {
      if (checkInDataError) {
        updateError('refresh-on-details');
      }
    },
    [checkInDataError, updateError],
  );

  const renderLoadingMessage = () => {
    return (
      <div>
        <va-loading-indicator
          data-testid="loading-indicator"
          message={t('loading')}
        />
      </div>
    );
  };

  const renderConfirmationMessage = () => {
    return (
      <Wrapper
        pageTitle={t('youre-checked-in')}
        testID="multiple-appointments-confirm"
      >
        <p className="vads-u-font-family--serif">{t('your-appointment')}</p>
        <ul
          className="vads-u-border-top--1px vads-u-margin-bottom--4 check-in--appointment-list"
          data-testid="appointment-list"
        >
          <AppointmentListItem
            appointment={appointment}
            key={0}
            showDetailsLink
            goToDetails={handleDetailClick}
            router={router}
            page="confirmation"
            app={APP_NAMES.CHECK_IN}
          />
        </ul>

        <va-alert
          show-icon
          data-testid="confirmation-alert"
          class="vads-u-margin-bottom--2"
          uswds
          slim
        >
          <div>
            {`${t(
              'well-get-you-from-waiting-room-when-time-for-your-appointment',
            )} `}
            {t('if-you-wait-more-than')}
          </div>
        </va-alert>

        {doTravelPay && (
          <TravelPayAlert
            travelPayEligible={travelPayEligible}
            travelPayClaimError={travelPayClaimError}
          />
        )}

        {isTravelReimbursementEnabled ? (
          !doTravelPay && (
            <va-alert
              show-icon
              data-testid="travel-pay-info-message"
              uswds
              slim
            >
              <p className="vads-u-margin-top--0">
                {t('travel-pay-reimbursement--info-message')}
              </p>
              <ExternalLink
                href="/health-care/get-reimbursed-for-travel-pay/"
                hrefLang="en"
                eventId="request-travel-pay-reimbursement-from-confirmation-with-no-reimbursement--link-clicked"
                eventPrefix="nav"
              >
                {t('find-out-if-youre-eligible--link')}
              </ExternalLink>
            </va-alert>
          )
        ) : (
          <TravelPayReimbursementLink />
        )}
        {appointments.length > 1 && <BackToAppointments />}
      </Wrapper>
    );
  };

  if (
    !isCheckInDataLoading &&
    (!isTravelReimbursementEnabled ||
      !travelPayEligible ||
      (travelPayClaimRequested === false || travelPayClaimSent) ||
      !getShouldSendTravelPayClaim(window))
  ) {
    return renderConfirmationMessage();
  }

  return renderLoadingMessage();
};

CheckInConfirmation.propTypes = {
  appointments: PropTypes.array,
  router: PropTypes.object,
  selectedAppointment: PropTypes.object,
  triggerRefresh: PropTypes.func,
};

export default CheckInConfirmation;
