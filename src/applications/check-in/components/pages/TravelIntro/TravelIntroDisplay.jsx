import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-unresolved
import Wrapper from '../../layout/Wrapper';

const TravelIntroDisplay = ({ header, fileClaimClick }) => {
  const { t } = useTranslation();

  return (
    <>
      <Wrapper pageTitle={header} classNames="travel-page">
        <p className="vads-u-margin-bottom--0">
          <Trans
            i18nKey="you-can-use-this-tool-file-claim"
            components={[
              <span key="bold" className="vads-u-font-weight--bold" />,
            ]}
          />
        </p>
        <va-process-list uswds>
          <va-process-list-item header={t('check-your-eligibility')}>
            <p>
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
          <va-process-list-item header={t('file-your-claim')}>
            <p>{t('if-youre-claiming-mileage-file-online-now')}</p>
            <a
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
TravelIntroDisplay.propTypes = {
  fileClaimClick: PropTypes.func.isRequired,
  header: PropTypes.string.isRequired,
};
export default TravelIntroDisplay;
