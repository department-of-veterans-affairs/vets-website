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
import ExternalLink from '../../../components/ExternalLink';

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
    travelPayClaimRequested,
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
  const doTravelPay = isTravelReimbursementEnabled && travelPayClaimRequested;

  if (doTravelPay && !isLoading) {
    pageTitle += ' ';
    if (travelPayClaimData && !travelPayClaimError && travelPayEligible) {
      pageTitle += t('received-reimbursement-claim');
    } else {
      pageTitle += t('we-couldnt-file-reimbursement');
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

        <va-alert
          background-only
          show-icon
          data-testid="confirmation-alert"
          class="vads-u-margin-bottom--2"
        >
          <div>
            {t(
              'well-come-get-you-from-the-waiting-room-when-its-time-for-your-appointment-to-start',
            )}
            {t('if-you-wait-more-than')}
          </div>
        </va-alert>

        {doTravelPay &&
          travelPayEligible &&
          travelPayClaimData && (
            <va-alert
              background-only
              show-icon
              data-testid="travel-pay-message"
            >
              <div>
                <p className="vads-u-margin-top--0">
                  {t('check-travel-claim-status')}
                </p>
                <ExternalLink
                  href="/health-care/get-reimbursed-for-travel-pay/"
                  hrefLang="en"
                  eventId="request-travel-pay-reimbursement-from-travel-success--link-clicked"
                  eventPrefix="nav"
                >
                  {t('go-to-the-accessva-travel-claim-portal-now')}
                </ExternalLink>
              </div>
            </va-alert>
          )}

        {doTravelPay &&
          !travelPayEligible && (
            <va-alert
              background-only
              show-icon
              data-testid="travel-pay-message"
              status="warning"
            >
              <p className="vads-u-margin-top--0">
                <Trans
                  i18nKey="travel-pay-cant-file-message"
                  components={[
                    <span key="bold" className="vads-u-font-weight--bold" />,
                  ]}
                />
              </p>
              <ExternalLink
                href="/health-care/get-reimbursed-for-travel-pay/"
                hrefLang="en"
                eventId="request-travel-pay-reimbursement-from-travel-ineligible--link-clicked"
                eventPrefix="nav"
              >
                {t('find-out-how-to-file--link')}
              </ExternalLink>
            </va-alert>
          )}

        {doTravelPay &&
          travelPayEligible &&
          travelPayClaimError && (
            <va-alert
              background-only
              show-icon
              data-testid="travel-pay-message"
              status="error"
            >
              <p className="vads-u-margin-top--0">
                {t('travel-claim-submission-error')}
              </p>
              <ExternalLink
                href="/health-care/get-reimbursed-for-travel-pay/"
                hrefLang="en"
                eventId="request-travel-pay-reimbursement-from-travel-error--link-clicked"
                eventPrefix="nav"
              >
                {t('go-to-the-accessva-travel-claim-portal-now')}
              </ExternalLink>
            </va-alert>
          )}
        {isTravelReimbursementEnabled ? (
          !doTravelPay && (
            <va-alert
              background-only
              show-icon
              data-testid="travel-pay-info-message"
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
        {appointments.length > 1 && (
          <BackToAppointments appointments={appointments} />
        )}
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
