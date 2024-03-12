import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import Wrapper from '../../../components/layout/Wrapper';
import { createAnalyticsSlug } from '../../../utils/analytics';
import { useFormRouting } from '../../../hooks/useFormRouting';
import { APP_NAMES } from '../../../utils/appConstants';
import ExternalLink from '../../../components/ExternalLink';

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
        classNames="travel-page"
      >
        <p className="vads-u-margin-bottom--0">
          {t('you-can-use-this-tool-file-claim')}
        </p>
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
              target="_blank"
              rel="noreferrer"
              eventId="travel-reimbursement-eligibility--link-clicked"
              hrefLang="en"
              eventPrefix="nav"
            >
              {t('travel-reimbursement-eligibility')}
              <i
                aria-hidden="true"
                className="fas fa-external-link-alt vads-u-margin-left--1"
              />
            </ExternalLink>
          </va-process-list-item>
          <va-process-list-item>
            <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0">
              {t('file-your-claim')}
            </h2>
            <p className="vads-u-margin-top--0">
              {t('if-youre-claiming-mileage-file-online-now')}
            </p>
            <a
              data-testid="file-claim-link"
              className="vads-c-action-link--green"
              href="#file-travel-claim"
              onKeyDown={fileClaimClick}
              onClick={fileClaimClick}
            >
              {t('file-mileage-only-claim')}
            </a>
            <p>
              {t('if-claiming-other-expenses-file-online-or-mail-or-in-person')}
            </p>
            <ExternalLink
              href="https://www.va.gov/health-care/get-reimbursed-for-travel-pay/"
              eventId="learn-how-to-file-claims-for-other-expenses--link-clicked"
              className="vads-c-action-link--blue"
              hrefLang="en"
              eventPrefix="nav"
            >
              {t('learn-how-file-claims-other-expenses')}
            </ExternalLink>
          </va-process-list-item>
        </va-process-list>
        <va-summary-box class="vads-u-margin-bottom--1" uswds>
          <h2
            className="vads-u-font-family--sans vads-u-margin-top--0"
            slot="headline"
          >
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
        </va-summary-box>
      </Wrapper>
    </>
  );
};

TravelIntro.propTypes = {
  router: PropTypes.object,
};

export default TravelIntro;
