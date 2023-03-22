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
  let errorStatus = '';
  let errorLinkEventId = 'clicked-how-to-file-link-from-api-error';
  if (
    travelPayClaimError &&
    travelPayClaimErrorCode === 'CLM_002_CLAIM_EXISTS'
  ) {
    errorMsg = t('check-travel-claim-status');
    errorStatus = 'info';
    errorLinkEventId = 'clicked-how-to-file-link-from-claim-exists-error';
  } else {
    errorMsg = (
      <Trans
        i18nKey="sorry-something-went-wrong-on-our-end-with-filing-your-travel-claim"
        components={[<span key="bold" className="vads-u-font-weight--bold" />]}
      />
    );
    errorStatus = 'warning';
  }

  return (
    <>
      {travelPayEligible &&
        travelPayClaimData && (
          <va-alert
            background-only
            show-icon
            data-testid="travel-pay-message"
            status="success"
          >
            <div>
              <p
                className="vads-u-margin-top--0"
                data-testid="travel-pay-eligible-success-message"
              >
                <Trans
                  i18nKey="processing-travel-claim"
                  components={[
                    <span key="bold" className="vads-u-font-weight--bold" />,
                  ]}
                />
              </p>
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
            href="/resources/how-to-file-a-va-travel-reimbursement-claim-online/"
            hrefLang="en"
            eventId="clicked-how-to-file-link-from-ineligible"
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
            status={errorStatus}
          >
            <p
              className="vads-u-margin-top--0"
              data-testid="travel-pay-claim-error-message"
            >
              {errorMsg}
            </p>
            <ExternalLink
              href="/resources/how-to-file-a-va-travel-reimbursement-claim-online/"
              hrefLang="en"
              eventId={errorLinkEventId}
              eventPrefix="nav"
            >
              {t('find-out-how-to-file--link')}
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
