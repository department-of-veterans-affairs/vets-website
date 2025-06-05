import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import environment from 'platform/utilities/environment';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { TITLE } from '../constants';
import ShowAlertOrSip from '../components/ShowAlertOrSip';

export const IntroductionPage = props => {
  const { route, location, user } = props;

  const { formConfig, pageList } = route;

  const {
    formId = formConfig.formId,
    prefillEnabled,
    savedFormMessages,
    downtime,
  } = formConfig;

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const disputeDebtActive = useToggleValue(TOGGLE_NAMES.disputeDebt);

  const sipOptions = {
    formId,
    startText: 'Start your dispute',
    unauthStartText: 'Sign in or create an account',
    messages: savedFormMessages,
    gaStartEventName: 'digital-dispute-request',
    pageList,
    formConfig,
    retentionPeriod: '60 days',
    downtime,
    prefillEnabled,
    hideUnauthedStartLink: true,
    useActionLinks: true,
  };

  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} />
      {disputeDebtActive ? (
        <>
          <h3 className="vads-u-font-weight--normal">
            If you think your VA debt is an error, use this form to dispute all
            or part of the debt.{' '}
          </h3>
          <ShowAlertOrSip
            user={user}
            basename={location?.basename || ''}
            sipOptions={sipOptions}
            pageList={pageList}
            formConfig={formConfig}
          />
          <h2>What to know before you fill out this form</h2>
          <div>
            <ul>
              <li>
                Right now, you can only use this form to dispute debts from
                benefit overpayments. You can’t use it to dispute copay bills at
                this time.{' '}
                <a href="https://www.va.gov/health-care/pay-copay-bill/dispute-charges/">
                  Learn how to dispute copay bills
                </a>
                . You may need to make payments on your debt while we review
                your dispute.
              </li>
            </ul>
          </div>
          <br />

          <ShowAlertOrSip
            user={user}
            basename={location?.basename || ''}
            sipOptions={sipOptions}
            pageList={pageList}
            formConfig={formConfig}
            bottom
          />
        </>
      ) : (
        <va-alert status="error" visible>
          <h2 slot="headline">We’re sorry. This application is unavailable.</h2>
          <p className="vads-u-font-size--base vads-u-font-family--sans">
            We are currently working on this application
          </p>
          <a
            className="vads-c-action-link--green vads-u-margin-top--1p5"
            href={`${environment.BASE_URL}`}
          >
            Go back to VA.gov
          </a>
        </va-alert>
      )}
    </article>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool.isRequired,
      savedFormMessages: PropTypes.object.isRequired,
      downtime: PropTypes.object,
      formId: PropTypes.string,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
  user: PropTypes.shape({
    profile: PropTypes.object,
  }),
};

export default IntroductionPage;
