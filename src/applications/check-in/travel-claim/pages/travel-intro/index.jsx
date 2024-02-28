import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import Wrapper from '../../../components/layout/Wrapper';
import { createAnalyticsSlug } from '../../../utils/analytics';
import { hasMultipleFacilities } from '../../../utils/appointment';
import { useFormRouting } from '../../../hooks/useFormRouting';
import { makeSelectTravelClaimData } from '../../../selectors';
import TravelEligibilityAddtionalInfo from '../../../components/TravelEligibilityAdditionalInfo';

const TravelIntro = props => {
  const { router } = props;
  const { t } = useTranslation();
  const selectTravelClaimData = useMemo(makeSelectTravelClaimData, []);
  const appointments = useSelector(selectTravelClaimData);
  const { jumpToPage } = useFormRouting(router);

  const nextPage = hasMultipleFacilities(appointments)
    ? 'select-appointment'
    : 'travel-mileage';
  const fileClaimClick = useCallback(
    e => {
      if (e?.key && e.key !== ' ') {
        return;
      }
      recordEvent({
        event: createAnalyticsSlug('file-travel-clicked', 'nav'),
      });
      e.preventDefault();
      jumpToPage(nextPage);
    },
    [jumpToPage, nextPage],
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
            <va-additional-info
              trigger={t('travel-reimbursement-eligibility')}
              uswds
            >
              <TravelEligibilityAddtionalInfo />
            </va-additional-info>
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
            <a
              className="vads-c-action-link--blue"
              href="https://www.va.gov/health-care/get-reimbursed-for-travel-pay/"
            >
              {t('learn-how-file-claims-other-expenses')}
            </a>
          </va-process-list-item>
        </va-process-list>
        <va-featured-content class="vads-u-margin-bottom--1" uswds>
          <h2
            className="vads-u-font-family--sans vads-u-margin-top--0"
            slot="headline"
          >
            {t('set-up-direct-deposit')}
          </h2>
          <p>{t('set-up-direct-deposit-to-receive-travel-reimbursement')}</p>
          <a href="https://www.va.gov/resources/how-to-set-up-direct-deposit-for-va-travel-pay-reimbursement/">
            {t('set-up-direct-deposit')}
          </a>
        </va-featured-content>
      </Wrapper>
    </>
  );
};

TravelIntro.propTypes = {
  // temp prop remove after data fetch in place
  appointments: PropTypes.array,
  router: PropTypes.object,
};

export default TravelIntro;
