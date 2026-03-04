import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { scrollAndFocus } from 'platform/utilities/scroll';
import { toggleLoginModal as toggleLoginModalAction } from '~/platform/site-wide/user-nav/actions';
import { connect } from 'react-redux';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import {
  isLoggedIn,
  isProfileLoading,
  selectProfile,
} from '@department-of-veterans-affairs/platform-user/selectors';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import OmbInfo from '../components/OmbInfo';
import ProcessList from '../components/ProcessList';
import TechnologyProgramAccordion from '../components/TechnologyProgramAccordion';
import { TITLE, SUBTITLE } from '../constants';

const IntroductionPage = props => {
  const { route, toggleLoginModal, loggedIn, showLoadingIndicator } = props;
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
      <FormTitle title={TITLE} subTitle={SUBTITLE} />
      <p>
        Use this form to apply for the VET TEC 2.0 Program, which covers
        short-term, high-tech training like coding bootcamps and IT courses not
        typically covered by the GI Bill. If approved, VA will pay your tuition,
        housing allowance, and book stipend while you’re enrolled.
      </p>
      <h2 className="vad-u-margin-top--0">
        Follow these steps to get started:
      </h2>
      <ProcessList />
      <div className="vads-u-margin-y--2 mobile-lg:vads-u-margin-y--3">
        {!loggedIn ? (
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
              <SignInButton />
            </span>
          </va-alert-sign-in>
        ) : (
          <>
            <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--3">
              Start your application for benefits
            </h3>
            <SaveInProgressIntro
              prefillEnabled={route.formConfig.prefillEnabled}
              messages={route.formConfig.savedFormMessages}
              formConfig={route.formConfig}
              pageList={route.pageList}
              startText="Start your application for VET TEC 2.0"
            />
          </>
        )}
      </div>
      <OmbInfo />
      <TechnologyProgramAccordion />
    </article>
  );
};
const mapDispatchToProps = dispatch => ({
  toggleLoginModal: () => dispatch(toggleLoginModalAction(true)),
});

IntroductionPage.propTypes = {
  loggedIn: PropTypes.bool,
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.object,
      downtime: PropTypes.object,
    }),
    pageList: PropTypes.array,
  }),
  showLoadingIndicator: PropTypes.bool,
  toggleLoginModal: PropTypes.func,
};
function mapStateToProps(state) {
  return {
    formData: state.form?.data || {},
    loggedIn: isLoggedIn(state),
    profile: selectProfile(state),
    showLoadingIndicator: isProfileLoading(state),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);
