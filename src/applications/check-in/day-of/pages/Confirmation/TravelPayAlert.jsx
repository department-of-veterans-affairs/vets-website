import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation, Trans } from 'react-i18next';
import ExternalLink from '../../../components/ExternalLink';

const TravelPayAlert = props => {
  const {
    travelPayEligible,
    travelPayClaimData,
    travelPayClaimError,
    travelPayClaimErrorCode,
  } = props;

  const { t } = useTranslation();

  let errorMsg = '';
  if (travelPayClaimError) {
    switch (travelPayClaimErrorCode) {
      case 'CLM_001_MULTIPLE_APPTS':
        errorMsg = t('travel-claim-submission-multiple-error');
        break;

      case 'CLM_002_CLAIM_EXISTS':
        errorMsg = t('travel-claim-submission-exists-error');
        break;

      default:
        errorMsg = t('travel-claim-submission-generic-error');
    }
  }

  return (
    <>
      {travelPayEligible &&
        travelPayClaimData && (
          <va-alert background-only show-icon data-testid="travel-pay-message">
            <div>
              <p
                className="vads-u-margin-top--0"
                data-testid="travel-pay-eligible-success-message"
              >
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

      {!travelPayEligible && (
        <va-alert
          background-only
          show-icon
          data-testid="travel-pay-message"
          status="warning"
        >
          <p
            className="vads-u-margin-top--0"
            data-testid="travel-pay-not-eligible-message"
          >
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

      {travelPayEligible &&
        travelPayClaimError && (
          <va-alert
            background-only
            show-icon
            data-testid="travel-pay-message"
            status="error"
          >
            <p
              className="vads-u-margin-top--0"
              data-testid="travel-pay-claim-error-message"
            >
              {errorMsg}
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
    </>
  );
};

TravelPayAlert.propTypes = {
  travelPayClaimError: PropTypes.bool.isRequired,
  travelPayEligible: PropTypes.bool.isRequired,
  travelPayClaimData: PropTypes.object,
  travelPayClaimErrorCode: PropTypes.string,
};

export default TravelPayAlert;
