import React, { useEffect, useCallback } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { toggleLoginModal as toggleLoginModalAction } from '~/platform/site-wide/user-nav/actions';
import { isLoggedIn, selectProfile } from 'platform/user/selectors';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { TITLE, SUBTITLE } from '../constants';

const OMB_RES_BURDEN = 15;
const OMB_NUMBER = '2900-0695';
const OMB_EXP_DATE = '01/31/2028';

const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Check your eligibility">
        <p>
          You’ll need to have applied for at least one of these VA education
          benefits and be found eligible in order for your reimbursement to be
          processed. You must have also paid in full for the test:
        </p>
        <ul>
          <li>
            <a href="/">Chapter 33: VA Form 22-1990</a> <strong> or,</strong>
          </li>
          <li>
            <a href="/">Chapter 33: VA Form 22-5490</a>
          </li>
        </ul>
      </va-process-list-item>
      <va-process-list-item header="Gather your information">
        <h4>Here’s what you’ll need to fill out this form:</h4>
        <ul>
          <li>
            Your social security number or VA file number along with payee
            number (if applicable)
          </li>
          <li>Your current mailing address and contact information</li>
          <li>
            The name of the licensing or certification test and date test was
            taken
          </li>
          <li>
            The name and address of organization issuing the license or
            certification
          </li>
          <li>A receipt and a copy of your test results</li>
        </ul>
      </va-process-list-item>
      <va-process-list-item header="Fill out the online form">
        <p>
          We’ll take you through each step of the process. It should take about
          15 minutes. You’ll also be provided the opportunity to give additional
          commentary regarding your licensing or certification test.
        </p>
      </va-process-list-item>
      <va-process-list-item header="Upload your form and attachments to QuickSubmit or mail them to your Regional Processing Office">
        <p>
          You will need to take your completed form as well as your receipt and
          test results to QuickSubmit to finish the submission process there.
        </p>
        <p>
          If you would rather print and mail your form and attachments, the
          addresses for your region will be listed at the end of this form.
        </p>
      </va-process-list-item>
    </va-process-list>
  );
};

export const IntroductionPage = props => {
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const { route, toggleLoginModal } = props;
  const { formConfig, pageList } = route;

  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  const showSignInModal = useCallback(
    () => {
      toggleLoginModal(true, 'ask-va', true);
    },
    [toggleLoginModal],
  );

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />
      <p className="vads-u-font-size--lg vads-u-font-family--serif vads-u-color--base vads-u-font-weight--normal">
        Use this form to request reimbursement for licensing or certification
        test fees and use your VA education benefits.
      </p>
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        Follow the steps below to apply for education benefits.
      </h2>
      <ProcessList />
      <va-additional-info trigger="What happens after you submit your form">
        <p>
          After you successfully submit your form, we will review your
          documents. You should hear back within 30 days about your
          reimbursement.
        </p>
      </va-additional-info>
      {!userLoggedIn ? (
        <va-alert-sign-in
          data-testid="sign-in-alert"
          disable-analytics
          heading-level={3}
          no-sign-in-link={null}
          time-limit={null}
          variant="signInRequired"
          visible
        >
          <span slot="SignInButton">
            <VaButton
              text="Sign in or create an account"
              onClick={showSignInModal}
            />
          </span>
        </va-alert-sign-in>
      ) : (
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the application"
          devOnly={{
            forceShowFormControls: true,
          }}
        />
      )}
      <p />
      <va-omb-info
        res-burden={OMB_RES_BURDEN}
        omb-number={OMB_NUMBER}
        exp-date={OMB_EXP_DATE}
      />
    </article>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool.isRequired,
      savedFormMessages: PropTypes.object.isRequired,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
  loggedIn: PropTypes.bool,
  toggleLoginModal: PropTypes.func,
};
function mapStateToProps(state) {
  return {
    formData: state.form?.data || {},
    loggedIn: isLoggedIn(state),
    profile: selectProfile(state),
  };
}
const mapDispatchToProps = dispatch => ({
  toggleLoginModal: () => dispatch(toggleLoginModalAction(true)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);
