import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation, Trans } from 'react-i18next';

import scrollToTop from 'platform/utilities/ui/scrollToTop';

import { makeSelectFeatureToggles } from '../../../utils/selectors/feature-toggles';
import BackToAppointments from '../../../components/BackToAppointments';
import TravelPayReimbursementLink from '../../../components/TravelPayReimbursementLink';
import Wrapper from '../../../components/layout/Wrapper';
import AppointmentConfirmationListItem from '../../../components/AppointmentDisplay/AppointmentConfirmationListItem';
import useSendTravelPayClaim from '../../../hooks/useSendTravelPayClaim';

const CheckInConfirmation = props => {
  const { appointments, selectedAppointment, triggerRefresh } = props;

  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const featureToggles = useSelector(selectFeatureToggles);
  const { isTravelReimbursementEnabled } = featureToggles;

  const { t } = useTranslation();

  const {
    isLoading,
    travelPayEligible,
    travelPayClaimError,
    travelPayClaimData,
  } = useSendTravelPayClaim();

  const appointment = selectedAppointment;
  const appointmentDateTime = new Date(appointment.startTime);

  useEffect(
    () => {
      scrollToTop('topScrollElement');
      triggerRefresh();
    },
    [triggerRefresh],
  );

  let pageTitle = t('youre-checked-in', {
    date: appointmentDateTime,
  });

  if (isTravelReimbursementEnabled && !isLoading) {
    pageTitle += '. ';
    if (travelPayClaimData && !travelPayClaimError && travelPayEligible) {
      pageTitle += t('received-reimbursement-claim');
    } else {
      pageTitle += t('sorry-couldnt-file-reimbursement');
    }
  }

  const renderLoadingMessage = () => {
    return (
      <va-loading-indicator
        data-testid="loading-indicator"
        message={t('loading')}
      />
    );
  };

  const renderConfirmationMessage = () => {
    return (
      <Wrapper pageTitle={pageTitle} testID="multiple-appointments-confirm">
        <p>{t('your-appointment')}</p>
        <ol
          className="vads-u-border-top--1px vads-u-margin-bottom--4 check-in--appointment-list"
          data-testid="appointment-list"
        >
          <AppointmentConfirmationListItem appointment={appointment} key={0} />
        </ol>

        <va-alert background-only show-icon data-testid="confirmation-alert">
          <div>
            {t(
              'well-come-get-you-from-the-waiting-room-when-its-time-for-your-appointment-to-start',
            )}
          </div>
        </va-alert>

        {isTravelReimbursementEnabled && <br />}

        {isTravelReimbursementEnabled &&
          travelPayEligible &&
          travelPayClaimData && (
            <va-alert
              background-only
              show-icon
              data-testid="travel-pay-message"
            >
              <div>
                <strong>{t('reimbursement-claim-number')}</strong>
                <br />
                {travelPayClaimData.claimId}
                <br />
                <br />
                {t('check-travel-claim-status')}
              </div>
            </va-alert>
          )}

        {isTravelReimbursementEnabled &&
          !travelPayEligible && (
            <va-alert
              background-only
              show-icon
              data-testid="travel-pay-message"
              status="warning"
            >
              <Trans
                i18nKey="travel-pay-cant-file-message"
                components={[
                  <span key="bold" className="vads-u-font-weight--bold" />,
                ]}
              />
            </va-alert>
          )}

        {isTravelReimbursementEnabled &&
          travelPayEligible &&
          travelPayClaimError && (
            <va-alert
              background-only
              show-icon
              data-testid="travel-pay-message"
              status="error"
            >
              <div>{t('travel-claim-submission-error')}</div>
            </va-alert>
          )}
        <TravelPayReimbursementLink />
        <BackToAppointments appointments={appointments} />
      </Wrapper>
    );
  };

  return isLoading ? renderLoadingMessage() : renderConfirmationMessage();
};

CheckInConfirmation.propTypes = {
  appointments: PropTypes.array,
  selectedAppointment: PropTypes.object,
  triggerRefresh: PropTypes.func,
};

export default CheckInConfirmation;
