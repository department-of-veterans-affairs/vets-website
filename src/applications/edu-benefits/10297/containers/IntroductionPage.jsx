import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { scrollAndFocus } from 'platform/utilities/scroll';
import { toggleLoginModal as toggleLoginModalAction } from '~/platform/site-wide/user-nav/actions';
import { connect } from 'react-redux';
import {
  isLOA1,
  isLOA3,
  isLoggedIn,
  isProfileLoading,
  selectProfile,
} from '@department-of-veterans-affairs/platform-user/selectors';
import {
  // VaAlertSignIn,
  VaButton,
  // VaSearchInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import OmbInfo from '../components/OmbInfo';
import ProcessList from '../components/ProcessList';
import TechnologyProgramAccordion from '../components/TechnologyProgramAccordion';

const IntroductionPage = props => {
  const {
    route,
    toggleLoginModal,
    loggedIn,
    showLoadingIndicator,
    isUserLOA1,
    isUserLOA3,
    isLoggedOut,
    signInServiceName,
  } = props;
  useEffect(() => {
    const h1 = document.querySelector('h1');
    scrollAndFocus(h1);
  }, []);
  const showSignInModal = useCallback(
    () => {
      toggleLoginModal(true, 'ask-va', true);
    },
    [toggleLoginModal],
  );
  function SignInButton() {
    return (
      <span slot="SignInButton">
        <VaButton
          text="Sign in or create an account"
          onClick={showSignInModal}
        />
      </span>
    );
  }
  useEffect(
    () => {
      const params = new URLSearchParams(window.location.search);
      if (
        params.get('showSignInModal') === 'true' &&
        !loggedIn &&
        !showLoadingIndicator
      ) {
        showSignInModal();
      }
    },
    [loggedIn, showLoadingIndicator, toggleLoginModal, showSignInModal],
  );

  return (
    <article className="schemaform-intro form-10297-introduction-page">
      <FormTitle title="Apply for the High Technology Program" />
      <div>
        <p className="vads-u-margin-y--2">
          High Technology Veterans Education, Training and Skills (HITECH VETS)
          program (VA Form 22-10297)
        </p>
      </div>
      <p>
        Use this form to apply for the High Technology Program, which covers
        short-term, high-tech training like coding bootcamps and IT courses not
        typically covered by the GI Bill. If approved, VA will pay your tuition,
        housing allowance, and book stipend while you’re enrolled.
      </p>
      <h2 className="vad-u-margin-top--0">
        Follow these steps to get started:
      </h2>
      <ProcessList />
      <va-additional-info trigger="What happens after I apply?">
        <p className="additional-info-content">
          If you’re eligible and the 4,000-student cap hasn’t been met, we’ll
          email you a Certificate of Eligibility. Otherwise, we’ll explain why
          you’re not eligible.
        </p>
      </va-additional-info>
      <div className="vads-u-margin-y--2 mobile-lg:vads-u-margin-y--3">
        <va-alert-sign-in
          disable-analytics
          heading-level={3}
          no-sign-in-link={null}
          time-limit={null}
          variant="signInRequired"
          visible
        >
          <span slot="SignInButton">
            <SignInButton />
          </span>
        </va-alert-sign-in>
        {/* <SaveInProgressIntro
          prefillEnabled={route.formConfig.prefillEnabled}
          messages={route.formConfig.savedFormMessages}
          formConfig={route.formConfig}
          pageList={route.pageList}
          startText="Start your application"
        /> */}
      </div>
      <OmbInfo />
      <TechnologyProgramAccordion />
    </article>
  );
};
const mapDispatchToProps = dispatch => ({
  toggleLoginModal: () => dispatch(toggleLoginModalAction(true)),
  // setFormData: setData,
});

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.object,
      downtime: PropTypes.object,
    }),
    pageList: PropTypes.array,
  }).isRequired,
};
function mapStateToProps(state) {
  const isLoggedOut = !isProfileLoading(state) && !isLoggedIn(state);
  return {
    formData: state.form?.data || {},
    loggedIn: isLoggedIn(state),
    profile: selectProfile(state),
    showLoadingIndicator: isProfileLoading(state),
    isLoggedOut,
    isUserLOA1: !isLoggedOut && isLOA1(state),
    isUserLOA3: !isLoggedOut && isLOA3(state),
    signInServiceName: selectProfile(state).signIn?.serviceName,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);
