import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation, Trans } from 'react-i18next';
import ExternalLink from '../../../components/ExternalLink';

const TravelPayAlert = props => {
  const { travelPayEligible, travelPayClaimError } = props;

  const { t } = useTranslation();

  return (
    <>
      {travelPayClaimError ? (
        <va-alert
          show-icon
          data-testid="travel-pay-message-error"
          status="warning"
          uswds
          slim
        >
          <div>
            <p
              className="vads-u-margin-top--0"
              data-testid="travel-pay-error-message"
            >
              <Trans
                i18nKey="sorry-something-went-wrong-on-our-end-with-filing-your-travel-claim"
                components={[
                  <span key="bold" className="vads-u-font-weight--bold" />,
                ]}
              />
            </p>
            <ExternalLink
              href="/health-care/get-reimbursed-for-travel-pay/"
              hrefLang="en"
              eventId="request-travel-pay-reimbursement-from-confirmation-with-btsss-error--link-clicked"
              eventPrefix="nav"
            >
              {t('find-out-how-to-file--link')}
            </ExternalLink>
          </div>
        </va-alert>
      ) : (
        <>
          {travelPayEligible && (
            <va-alert
              show-icon
              data-testid="travel-pay-message-success"
              status="success"
              uswds
              slim
            >
              <div>
                <p
                  className="vads-u-margin-y--0"
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
              show-icon
              data-testid="travel-pay-message-ineligible"
              status="warning"
              uswds
              slim
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
        </>
      )}
    </>
  );
};

TravelPayAlert.propTypes = {
  travelPayEligible: PropTypes.bool,
  travelPayClaimError: PropTypes.bool,
};

export default TravelPayAlert;
