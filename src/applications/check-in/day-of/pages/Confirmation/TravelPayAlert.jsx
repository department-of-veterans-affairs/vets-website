import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation, Trans } from 'react-i18next';
import ExternalLink from '../../../components/ExternalLink';

const TravelPayAlert = props => {
  const {
    travelPayEligible,
    travelPayClaimRequested,
    travelPayClaimError,
  } = props;

  const { t } = useTranslation();

  if (!travelPayClaimRequested) {
    return (
      <div data-testid="travel-pay-info-message">
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
  if (travelPayClaimError) {
    return (
      <va-alert
        show-icon
        data-testid="travel-pay-message"
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
    );
  }
  if (!travelPayEligible) {
    return (
      <va-alert
        show-icon
        data-testid="travel-pay-message"
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
    );
  }

  return (
    <va-alert
      show-icon
      data-testid="travel-pay-message"
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
  );
};

TravelPayAlert.propTypes = {
  travelPayClaimError: PropTypes.bool,
  travelPayClaimRequested: PropTypes.bool,
  travelPayEligible: PropTypes.bool,
};

export default TravelPayAlert;
