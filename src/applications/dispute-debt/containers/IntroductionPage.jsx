import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui/focus';
import { scrollToTop } from 'platform/utilities/scroll';
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

  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();
  const disputeDebtActive = useToggleValue(TOGGLE_NAMES.disputeDebt);
  const isLoadingFeatures = useToggleLoadingValue();

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

  // Show loading indicator while feature flags are loading
  if (isLoadingFeatures) {
    return (
      <va-loading-indicator
        label="Loading"
        message="Loading application..."
        set-focus
      />
    );
  }

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} />
      {disputeDebtActive ? (
        <>
          <p className="va-introtext">
            Use this form if you’d like to dispute all or part of the debt.
          </p>
          <h2>What to know before you fill out this form</h2>
          <div>
            <ul>
              <li>
                Right now, you can only use this form to dispute debts from
                benefit overpayments. You can’t use it to dispute copay bills at
                this time.
                <span className="vads-u-display--block">
                  <va-link
                    href="https://www.va.gov/health-care/pay-copay-bill/dispute-charges/"
                    text="Learn how to dispute copay bills"
                  />
                </span>
              </li>
              <li>
                You may need to make payments on your debt while we review your
                dispute.
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
