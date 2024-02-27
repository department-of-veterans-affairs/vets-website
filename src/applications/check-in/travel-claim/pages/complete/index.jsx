import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-unresolved
import Wrapper from '../../../components/layout/Wrapper';
import ExternalLink from '../../../components/ExternalLink';
import TravelClaimSuccessAlert from './TravelClaimSuccessAlert';

// @TODO Appointments will come from redux this is temp
import { multiFacility } from '../travel-intro/testAppointments';

const Complete = () => {
  const { t } = useTranslation();

  return (
    <>
      <Wrapper
        pageTitle={t('were-processing-your-travel-claim')}
        classNames="travel-page"
      >
        <TravelClaimSuccessAlert appointments={multiFacility} />
        <div data-testid="travel-complete-content">
          <p>
            <Trans
              i18nKey="to-file-another-claim-for-today"
              components={[
                <span key="bold" className="vads-u-font-weight--bold" />,
              ]}
            />
          </p>
          <p>{t('or-you-can-still-file-your-claim')}</p>
        </div>
        <ExternalLink
          key="link"
          href="https://www.va.gov/health-care/get-reimbursed-for-travel-pay/"
          hrefLang="en"
          eventId="travel-claim-info-clicked"
          eventPrefix="nav"
          dataTestId="travel-info-external-link"
        >
          {t('find-out-how-to-file--link')}
        </ExternalLink>
      </Wrapper>
    </>
  );
};

export default Complete;
