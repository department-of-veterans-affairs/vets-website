import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation, Trans } from 'react-i18next';
import { phoneNumbers } from '../utils/appConstants';
import ExternalLink from './ExternalLink';

const HelpBlock = ({ dayOfTravel, travelClaim }) => {
  const { t } = useTranslation();

  return (
    <div data-testid="help-block">
      {travelClaim && (
        <>
          <p data-testid="for-questions-about-filing">
            <Trans
              i18nKey="for-questions-about-filing-a-travel-reimbursement-claim"
              components={[
                <span key="bold" className="vads-u-font-weight--bold" />,
                <va-telephone
                  key={phoneNumbers.btsssCallCenter}
                  contact={phoneNumbers.btsssCallCenter}
                />,
              ]}
            />
          </p>
          <p data-testid="find-the-travel-contact-for-your-facility">
            <ExternalLink
              href="https://www.va.gov/HEALTHBENEFITS/vtp/beneficiary_travel_pocs.asp"
              hrefLang="en"
              eventId="find-health-benefits-travel-pocs--link-clicked"
              eventPrefix="nav"
            >
              {t('find-the-travel-contact-for-your-facility')}
            </ExternalLink>
          </p>
          <p data-testid="if-you-have-questions">
            <Trans
              i18nKey="if-you-have-questions-about-your-appointments"
              components={[
                <span key="bold" className="vads-u-font-weight--bold" />,
              ]}
            />
          </p>
        </>
      )}

      {!travelClaim && (
        <>
          <p data-testid="for-help-using-this-tool">
            <Trans
              i18nKey="for-help-using-this-tool-to-prepare-for-your-appointments"
              components={[
                <span key="bold" className="vads-u-font-weight--bold" />,
                <va-telephone
                  key={phoneNumbers.mainInfo}
                  contact={phoneNumbers.mainInfo}
                />,
                <va-telephone
                  key={phoneNumbers.tty}
                  contact={phoneNumbers.tty}
                  tty
                  ariaLabel="7 1 1."
                />,
              ]}
            />
          </p>
          <p data-testid="if-you-have-questions">
            <Trans
              i18nKey="if-you-have-questions-about-your-appointments"
              components={[
                <span key="bold" className="vads-u-font-weight--bold" />,
              ]}
            />
          </p>
        </>
      )}
      <ExternalLink
        href="https://www.va.gov/find-locations"
        hrefLang="en"
        eventId="find-facility-locations--link-clicked"
        eventPrefix="nav"
      >
        {t('find-your-va-health-facility')}
      </ExternalLink>

      {dayOfTravel && (
        <>
          <p data-testid="for-questions-about-filing">
            <Trans
              i18nKey="for-questions-about-filing-a-travel-reimbursement-claim"
              components={[
                <span key="bold" className="vads-u-font-weight--bold" />,
                <va-telephone
                  key={phoneNumbers.btsssCallCenter}
                  contact={phoneNumbers.btsssCallCenter}
                />,
              ]}
            />
          </p>
          <ExternalLink
            href="https://www.va.gov/HEALTHBENEFITS/vtp/beneficiary_travel_pocs.asp"
            hrefLang="en"
            eventId="find-health-benefits-travel-pocs--link-clicked"
            eventPrefix="nav"
          >
            {t('find-the-travel-contact-for-your-facility')}
          </ExternalLink>
        </>
      )}

      <p data-testid="if-yourre-in-crisis">
        <Trans
          i18nKey="if-yourre-in-crisis-or-having-thoughts-of-suicide-call-the"
          data-testid="if-yourre-in-crisis"
          components={[
            <span key="bold" className="vads-u-font-weight--bold" />,
            <va-telephone
              key={phoneNumbers.veteransCrisisLine}
              contact={phoneNumbers.veteransCrisisLine}
            />,
            <va-telephone
              key={phoneNumbers.veteransCrisisText}
              contact={phoneNumbers.veteransCrisisText}
            />,
          ]}
        />
      </p>
      <p data-testid="if-you-think-your-life-is-in-danger">
        <Trans
          i18nKey="if-you-think-your-life-or-health-is-in-danger"
          components={[
            <span key="bold" className="vads-u-font-weight--bold" />,
            <va-telephone
              key={phoneNumbers.emergency}
              contact={phoneNumbers.emergency}
            />,
          ]}
        />
      </p>
    </div>
  );
};

HelpBlock.propTypes = {
  dayOfTravel: PropTypes.bool,
  travelClaim: PropTypes.bool,
};

export default HelpBlock;
