import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import Wrapper from '../../../components/layout/Wrapper';
import { createAnalyticsSlug } from '../../../utils/analytics';
import { useFormRouting } from '../../../hooks/useFormRouting';
import { APP_NAMES } from '../../../utils/appConstants';
import ExternalLink from '../../../components/ExternalLink';
import TravelPayOMB from '../../../components/TravelPayOMB';

const TravelIntro = props => {
  const { router } = props;
  const { t } = useTranslation();

  const { goToNextPage } = useFormRouting(router);

  const fileClaimClick = useCallback(
    e => {
      if (e?.key && e.key !== ' ') {
        return;
      }
      recordEvent({
        event: createAnalyticsSlug(
          'file-a-mileage-only-claim--link-clicked',
          'nav',
          APP_NAMES.TRAVEL_CLAIM,
        ),
      });
      e.preventDefault();
      goToNextPage();
    },
    [goToNextPage],
  );

  return (
    <>
      <Wrapper
        pageTitle={t('file-travel-reimbursement-claim')}
        testID="travel-intro-page"
        classNames="travel-page"
      >
        <p>{t('you-can-only-use-this-tool-to-file-claims-for-todays')}</p>
        <p>{t('youll-need-to-use-a-different-option-to-file')}</p>
        <ul>
          <li>{t('claims-for-past-va-appointments')}</li>
          <li>{t('claims-for-community-care-appointments')}</li>
          <li>{t('claims-for-other-expenses')}</li>
        </ul>
        <ExternalLink
          href="https://www.va.gov/health-care/get-reimbursed-for-travel-pay/"
          hrefLang="en"
        >
          {t('learn-how-to-file-other-types-of-claims')}
        </ExternalLink>
        <div className="vads-u-margin-top--2">
          <va-process-list uswds>
            <va-process-list-item>
              <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0">
                {t('check-your-eligibility')}
              </h2>
              <p className="vads-u-margin-top--0">
                {t('if-youre-eligible-for-travel-reimbursement-you-can-file')}
              </p>
              <ExternalLink
                href="https://www.va.gov/health-care/get-reimbursed-for-travel-pay/"
                eventId="travel-reimbursement-eligibility--link-clicked"
                hrefLang="en"
                eventPrefix="nav"
              >
                {t('travel-reimbursement-eligibility')}
              </ExternalLink>
            </va-process-list-item>
            <va-process-list-item>
              <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0">
                {t('file-your-claim')}
              </h2>
              <p className="vads-u-margin-top--0">
                {t('if-youre-claiming-mileage-file-online-now')}
              </p>
              <va-link-action
                href="#file-travel-claim"
                onKeyDown={fileClaimClick}
                onClick={fileClaimClick}
                text={t('file-mileage-only-claim')}
                data-testid="file-claim-link"
              />
            </va-process-list-item>
          </va-process-list>
        </div>
        <va-alert class="vads-u-margin-bottom--1" uswds status="info" show-icon>
          <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
            {t('set-up-direct-deposit')}
          </h2>
          <p>{t('set-up-direct-deposit-to-receive-travel-reimbursement')}</p>
          <ExternalLink
            href="https://www.va.gov/resources/how-to-set-up-direct-deposit-for-va-travel-pay-reimbursement/"
            eventId="set-up-direct-desposit--link-clicked"
            hrefLang="en"
            eventPrefix="nav"
          >
            {t('set-up-direct-deposit')}
          </ExternalLink>
        </va-alert>
        <TravelPayOMB />
      </Wrapper>
    </>
  );
};

TravelIntro.propTypes = {
  router: PropTypes.object,
};

export default TravelIntro;
