import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation, Trans } from 'react-i18next';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import Wrapper from '../../../components/layout/Wrapper';
import { createAnalyticsSlug } from '../../../utils/analytics';
import { hasMultipleFacilities } from '../../../utils/appointment';
import { useFormRouting } from '../../../hooks/useFormRouting';
// Appointments will come from redux this is temp
import { singleFacility } from './testAppointments';

const TravelIntro = props => {
  const { router, appointments = singleFacility } = props;
  const { t } = useTranslation();

  const { jumpToPage } = useFormRouting(router);
  // @TODO logic need to figure out if we should go to multi-facility page or single

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
          <Trans
            i18nKey="you-can-use-this-tool-file-claim"
            components={[
              <span key="bold" className="vads-u-font-weight--bold" />,
            ]}
          />
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
              <div>
                <Trans
                  i18nKey="this-must-be-true-youre-traveling-for-care"
                  components={[
                    <span key="bold" className="vads-u-font-weight--bold" />,
                  ]}
                />
                <ul className="vads-u-margin-bottom--0">
                  <li>
                    <Trans
                      i18nKey="you-have-a-va-disability-rating-of"
                      components={[
                        <span
                          key="bold"
                          className="vads-u-font-weight--bold"
                        />,
                      ]}
                    />
                  </li>
                  <li>
                    <Trans
                      i18nKey="youre-traveling-for-treatment-of-a-service-connected-condition"
                      components={[
                        <span
                          key="bold"
                          className="vads-u-font-weight--bold"
                        />,
                      ]}
                    />
                  </li>
                  <li>
                    <Trans
                      i18nKey="you-receive-va-pension-benefits"
                      components={[
                        <span
                          key="bold"
                          className="vads-u-font-weight--bold"
                        />,
                      ]}
                    />
                  </li>
                  <li>
                    <Trans
                      i18nKey="you-have-an-annual-income-below-the-maximum"
                      components={[
                        <span
                          key="bold"
                          className="vads-u-font-weight--bold"
                        />,
                      ]}
                    />
                  </li>
                  <li>
                    <Trans
                      i18nKey="you-cant-afford-to-pay-for-your-travel"
                      components={[
                        <span
                          key="bold"
                          className="vads-u-font-weight--bold"
                        />,
                      ]}
                    />
                  </li>
                  <li>
                    <Trans
                      i18nKey="youre-traveling-for-one-of-these-reasons"
                      components={[
                        <span
                          key="bold"
                          className="vads-u-font-weight--bold"
                        />,
                      ]}
                    />
                    <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0">
                      <Trans
                        i18nKey="youre-traveling-in-relation-to-a-compensation-and-pension"
                        components={[
                          <span
                            key="bold"
                            className="vads-u-font-weight--bold"
                          />,
                        ]}
                      />
                    </p>
                  </li>
                </ul>
              </div>
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
              {t(
                'if-claiming-other-expenses-file-online-or-mail-email-fax-in-person',
              )}
            </p>
            <a
              className="vads-c-action-link--green"
              href="https://www.va.gov/health-care/get-reimbursed-for-travel-pay/"
            >
              {t('learn-how-file-claims-other-expenses')}
            </a>
          </va-process-list-item>
        </va-process-list>
        <va-featured-content class="vads-u-margin-bottom--1" uswds>
          <h2 className="vads-u-font-family--sans vads-u-margin-top--0">
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
