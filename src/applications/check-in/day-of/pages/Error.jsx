import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';

import {
  makeSelectError,
  makeSelectForm,
  makeSelectVeteranData,
} from '../../selectors';
import { makeSelectFeatureToggles } from '../../utils/selectors/feature-toggles';
import Wrapper from '../../components/layout/Wrapper';
import { phoneNumbers } from '../../utils/appConstants';
import ExternalLink from '../../components/ExternalLink';
import ConfirmationAccordionBlock from '../../components/ConfirmationAccordionBlock';

const Error = () => {
  const { t } = useTranslation();
  const selectError = useMemo(makeSelectError, []);
  const { error } = useSelector(selectError);

  const selectForm = useMemo(makeSelectForm, []);
  const form = useSelector(selectForm);

  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const featureToggles = useSelector(selectFeatureToggles);
  const { isTravelReimbursementEnabled } = featureToggles;

  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);

  let alerts = [];
  let header = '';

  const getTravelMessage = () => {
    if (
      form.data['travel-question'] === 'no' ||
      !isTravelReimbursementEnabled
    ) {
      return (
        <div data-testid="check-in-failed-find-out">
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
        </div>
      );
    }
    if (
      form.data['travel-vehicle'] === 'no' ||
      form.data['travel-address'] === 'no' ||
      form.data['travel-mileage'] === 'no'
    ) {
      return (
        <div data-testid="check-in-failed-cant-file">
          <p
            className="vads-u-margin-top--0"
            data-testid="travel-pay-not-eligible-message"
          >
            <Trans
              i18nKey="travel-pay-cant-file-message--v2"
              components={[
                <span key="bold" className="vads-u-font-weight--bold" />,
              ]}
            />
          </p>
          <ExternalLink
            href="/resources/how-to-file-a-va-travel-reimbursement-claim-online/"
            hrefLang="en"
            eventId="clicked-how-to-file-link-from-ineligible"
            eventPrefix="nav"
          >
            {t('find-out-how-to-file--link')}
          </ExternalLink>
        </div>
      );
    }
    // Answered yes to everything
    return (
      <div data-testid="check-in-failed-file-later">
        <p className="vads-u-margin-top--0">
          <Trans
            i18nKey="were-sorry-cant-file-travel-file-later--info-message--v2"
            components={[
              <span key="bold" className="vads-u-font-weight--bold" />,
            ]}
          />
        </p>
        <ExternalLink
          href="/resources/how-to-file-a-va-travel-reimbursement-claim-online/"
          hrefLang="en"
          eventId="clicked-how-to-file-link-from-ineligible"
          eventPrefix="nav"
        >
          {t('find-out-how-to-file--link')}
        </ExternalLink>
      </div>
    );
  };

  switch (error) {
    case 'max-validation':
      header = t('we-couldnt-check-you-in');
      alerts = [
        {
          type: 'error',
          message: t(
            'were-sorry-we-couldnt-match-your-information-please-ask-for-help',
          ),
          alertTestId: 'error-message-max-validation',
        },
      ];
      break;
    case 'check-in-past-appointment':
    case 'uuid-not-found':
      // Shown when POST sessions returns 404.
      header = t('sorry-this-link-has-expired');
      alerts = [
        {
          type: 'warning',
          message: (
            <Trans
              i18nKey="trying-to-check-in-for-an-appointment--info-message"
              components={[
                <span key="bold" className="vads-u-font-weight--bold" />,
                <va-telephone
                  key={phoneNumbers.textCheckIn}
                  data-testid="error-message-sms"
                  contact={phoneNumbers.textCheckIn}
                  sms
                />,
              ]}
            />
          ),
          alertTestId: 'error-message-trying-to-check-in',
        },
      ];
      break;
    case 'check-in-post-error':
    case 'error-completing-check-in':
      header = t('we-couldnt-check-you-in');
      alerts = [
        {
          subHeading: t('your-appointments', { count: 1 }),
          type: 'warning',
          message: t(
            'were-sorry-something-went-wrong-on-our-end-check-in-with-a-staff-member',
          ),
          alertTestId: 'error-message-checkin-error',
        },
        {
          subHeading: t('travel-reimbursement'),
          type:
            form.data['travel-question'] === 'no' ||
            !isTravelReimbursementEnabled
              ? 'text'
              : 'warning',
          message: getTravelMessage(),
          travelMessage: true,
          alertTestId: 'error-message-checkin-error-travel-info',
        },
      ];
      break;
    default:
      header = t('we-couldnt-check-you-in');
      alerts = [
        {
          type: 'error',
          message: t(
            'were-sorry-something-went-wrong-on-our-end-check-in-with-a-staff-member',
          ),
          alertTestId: 'error-message-default-error',
        },
      ];
  }

  return (
    <Wrapper pageTitle={header}>
      {alerts.map((alert, index) => (
        <div key={`alert-${index}`}>
          {alert.subHeading && (
            <h2 data-testid="message-subheading">{alert.subHeading}</h2>
          )}
          {alert.type === 'text' ? (
            <div
              data-testid={alert.alertTestId}
              className={index !== 0 ? 'vads-u-margin-top--2' : ''}
            >
              {alert.message}
            </div>
          ) : (
            <va-alert
              show-icon
              status={alert.type}
              data-testid={alert.alertTestId}
              class={index !== 0 ? 'vads-u-margin-top--2' : ''}
              uswds
              slim
            >
              <div>{alert.message}</div>
            </va-alert>
          )}
        </div>
      ))}
      {error !== 'max-validation' && (
        <ConfirmationAccordionBlock errorPage appointments={appointments} />
      )}
    </Wrapper>
  );
};

export default Error;
