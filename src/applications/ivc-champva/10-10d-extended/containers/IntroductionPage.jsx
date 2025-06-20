import React, { useEffect } from 'react';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui/focus';
import { scrollToTop } from 'platform/utilities/scroll';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { TITLE, SUBTITLE } from '../constants';

const OMB_RES_BURDEN = 15;
const OMB_NUMBER = '2900-0219';
const OMB_EXP_DATE = '10/31/2024';

const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Prepare">
        <h4>To fill out this application, you’ll need your:</h4>
        <ul>
          <li>Social Security number (required)</li>
        </ul>
        <p>
          <strong>What if I need help filling out my application?</strong> An
          accredited representative, like a Veterans Service Officer (VSO), can
          help you fill out your claim.{' '}
          <a href="/disability-benefits/apply/help/index.html">
            Get help filing your claim
          </a>
        </p>
      </va-process-list-item>
      <va-process-list-item header="Apply">
        <p>Complete this benefits form.</p>
        <p>
          After submitting the form, you’ll get a confirmation message. You can
          print this for your records.
        </p>
      </va-process-list-item>
      <va-process-list-item header="VA Review">
        <p>
          We process claims within a week. If more than a week has passed since
          you submitted your application and you haven’t heard back, please
          don’t apply again. Call us at.
        </p>
      </va-process-list-item>
      <va-process-list-item header="Decision">
        <p>
          Once we’ve processed your claim, you’ll get a notice in the mail with
          our decision.
        </p>
      </va-process-list-item>
    </va-process-list>
  );
};

export const IntroductionPage = props => {
  const { route } = props;
  const { formConfig, pageList } = route;
  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        Follow the steps below to apply for CHAMPVA application (includes
        10-7959c).
      </h2>
      <ProcessList />
      <va-alert-sign-in variant="signInOptionalNoPrefill" visible>
        <span slot="SignInButton">
          <VaButton
            text="Sign in or create an account"
            onClick={() => props.toggleLoginModal(true)}
          />

          <p>
            <Link
              to={pageList?.[1]?.path}
              className="schemaform-start-button"
              aria-label="test-aria-label"
              aria-describedby="test-aria-desc-by"
            >
              Start your {formConfig?.customText?.appType} without signing in
            </Link>
          </p>
        </span>
      </va-alert-sign-in>
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
      customText: PropTypes.shape({ appType: PropTypes.string }),
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
  toggleLoginModal: PropTypes.func,
};

const mapDispatchToProps = {
  toggleLoginModal,
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.user.login.currentlyLoggedIn,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);
