import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-unresolved
import Wrapper from '../../layout/Wrapper';
import ExternalLink from '../../ExternalLink';
import TravelClaimSuccessAlert from './TravelClaimSuccessAlert';

// Appointments will come from redux this is temp
import { multiFacility } from '../../../travel-claim/pages/travel-intro/testAppointments';

const TravelCompleteDisplay = () => {
  const { t } = useTranslation();

  return (
    <>
      <Wrapper
        pageTitle={t('were-processing-your-travel-claim')}
        classNames="travel-page"
      >
        <TravelClaimSuccessAlert appointments={multiFacility} />
        <p>
          <Trans
            i18nKey="to-file-another-claim-for-today"
            components={[
              <span key="bold" className="vads-u-font-weight--bold" />,
            ]}
          />
        </p>
        <p>{t('or-you-can-still-file-your-claim')}</p>
        <ExternalLink
          key="link"
          href="https://www.va.gov/health-care/get-reimbursed-for-travel-pay/"
          hrefLang="en"
          eventId="travel-claim-info-clicked"
          eventPrefix="nav"
        >
          {t('find-out-how-to-file--link')}
        </ExternalLink>
      </Wrapper>
    </>
  );
};

export default TravelCompleteDisplay;
