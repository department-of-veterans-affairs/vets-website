import {
  VaAlertSignIn,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { getNextPagePath } from '@department-of-veterans-affairs/platform-forms-system/routing';
import {
  isLOA1,
  isLOA3,
  isLoggedIn,
  isProfileLoading,
  selectProfile,
} from '@department-of-veterans-affairs/platform-user/selectors';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import {
  VerifyIdmeButton,
  VerifyLogingovButton,
} from 'platform/user/authentication/components/VerifyButton';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';
import { toggleLoginModal as toggleLoginModalAction } from '~/platform/site-wide/user-nav/actions';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import Announcements from '../components/Announcements';
import Inbox from './Inbox';
import StatusChecker from '../components/introduction/StatusChecker';

const VerifiedAlert = (
  <div className="vads-u-margin-bottom--4">
    <va-alert close-btn-aria-label="Close notification" status="info" visible>
      <h2 id="track-your-status-on-mobile" slot="headline">
        We can prefill some of your information
      </h2>
      <p className="vads-u-margin-y--0">
        Since you’re signed in, we can prefill part of your question based on
        your profile details. You can also save your question in progress and
        come back later to finish filling it out.
      </p>
    </va-alert>
  </div>
);

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
  const { formConfig, pageList, pathname, formData } = route;
  // TODO Feature toggle this for CRM announcements on/off
  const showAnnouncements = false;

  const showSignInModal = useCallback(
    () => {
      toggleLoginModal(true, 'ask-va', true);
    },
    [toggleLoginModal],
  );

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

  const getStartPage = () => {
    const data = formData || {};
    if (pathname) return getNextPagePath(pageList, data, pathname);
    return pageList[1].path;
  };

  useEffect(
    () => {
      focusElement('.schemaform-title > h1');
    },
    [props],
  );

  const unAuthenticatedUI = () => {
    return (
      <>
        <h2 className="vads-u-margin-top--4">How to start</h2>
        <p className="">
          You can use Ask VA to ask a question online. You can ask about
          education, disability compensation, health care and many other topics.
        </p>
        <h3 className="vads-u-margin-top--1">
          Ask a question or read a reply from VA
        </h3>
        <p className="vads-u-margin-bottom--1">
          You need to sign in to ask a question about yourself, a family member
          or another Veteran. This form takes about 10 to 15 minutes to
          complete.
        </p>
        <p className="vads-u-margin-bottom--1">
          Signing in also lets you track your question and read a reply from VA
          when it’s ready.
        </p>

        {[CSP_IDS.ID_ME, CSP_IDS.LOGIN_GOV].includes(signInServiceName) ? (
          <VaAlertSignIn
            heading-level={4}
            variant={
              [CSP_IDS.ID_ME].includes(signInServiceName)
                ? 'verifyIdMe'
                : 'verifyLoginGov'
            }
            visible
          >
            {[CSP_IDS.ID_ME].includes(signInServiceName) ? (
              <span slot="IdMeVerifyButton">
                <VerifyIdmeButton />
              </span>
            ) : (
              <span slot="LoginGovVerifyButton">
                <VerifyLogingovButton />
              </span>
            )}
          </VaAlertSignIn>
        ) : (
          <VaAlertSignIn variant="signInRequired" visible headingLevel={4}>
            <span slot="SignInButton">
              <VaButton
                text="Sign in or create an account"
                onClick={showSignInModal}
              />
            </span>
          </VaAlertSignIn>
        )}

        <h3 className="vads-u-margin-top--6">
          If you need general information
        </h3>
        <p className="vads-u-margin-bottom--1">
          We recommend that you use the{' '}
          <Link href="https://www.va.gov/contact-us/virtual-agent/">
            chatbot
          </Link>{' '}
          or review <Link href="https://www.va.gov/resources/">FAQs</Link> to
          find general information more quickly. Otherwise, there are some
          questions you can ask without signing in. This form takes about 2 to 5
          minutes to complete.
        </p>
        <Link className="vads-c-action-link--blue" to={getStartPage}>
          Start your question without signing in
        </Link>
        <h2
          slot="headline"
          className="vads-u-margin-top--6 vads vads-u-margin-bottom--3"
        >
          Only use Ask VA for non-urgent needs
        </h2>
        <p className="vads-u-margin-bottom--2">
          <strong>If you think you think have a medical emergency,</strong> call
          911 or go to the nearest emergency room.
        </p>
        <p className="vads-u-margin-bottom--2">
          <strong>If you need to talk to someone right away, </strong>
          contact the Veterans Crisis Line. Whatever you’re struggling
          with—chronic pain, anxiety, depression, trouble sleeping, anger, or
          even homelessness—we can support you. Our Veterans Crisis Line is
          confidential (private), free, and available 24/7.
        </p>
        <p className="vads-u-margin-bottom--2">
          To connect with a Veterans Crisis Line responder anytime, day or
          night:
        </p>
        <ul>
          <li>
            Call <va-telephone contact="988" />, then select 1.
          </li>
          <li>
            Start a{' '}
            <a
              rel="noreferrer noopener"
              href="https://www.veteranscrisisline.net/get-help/chat"
            >
              confidential chat
            </a>
            .
          </li>
          <li>
            {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-telephone-component */}
            Text <a href="tel:+1838255">838255</a>.
          </li>
        </ul>
        <StatusChecker />
      </>
    );
  };

  const authenticatedUI = (
    <>
      <p>This form takes about 2 to 15 minutes to complete.</p>
      <div className="vads-u-margin-top--2 vads-u-margin-bottom--3">
        <va-additional-info trigger="When to use Ask VA">
          <div>
            <p>
              You can use Ask VA to ask a question online. You can ask about
              education, disability compensation, health care and many other
              topics.
            </p>
            <p>
              We will review your information and reply back in up to{' '}
              <span className="vads-u-font-weight--bold">7 business days</span>.
            </p>
            <p>
              If you need help now, use one of these urgent communication
              options:
            </p>
            <ul>
              <li>
                <strong>
                  If you’re in crisis or having thoughts of suicide,
                </strong>{' '}
                connect with our Veterans Crisis Line. We offer confidential
                support anytime, day or night.{' '}
                <a href="https://www.veteranscrisisline.net">
                  Connect with Veterans Crisis Line
                </a>
              </li>
              <li>
                <strong>If you think your life or health is in danger,</strong>{' '}
                call{' '}
                <va-telephone contact="911" message-aria-describedby="9 1 1" />,
                or go to the nearest emergency room.
              </li>
            </ul>
          </div>
        </va-additional-info>
      </div>
      <SaveInProgressIntro
        formConfig={{ ...formConfig, subTitle: '' }}
        messages={route.formConfig.savedFormMessages}
        prefillEnabled={formConfig.prefillEnabled}
        pageList={pageList}
        startText="Ask a new question"
        className="vads-u-margin--0"
        verifiedPrefillAlert={VerifiedAlert}
      />
      <Inbox />
    </>
  );

  const subTitle =
    'Get answers to your questions about VA benefits and service. You should receive a reply within 7 business days.';

  return (
    <div className="schemaform-intro">
      <div className="schemaform-title vads-u-margin-bottom--2">
        <h1 className="vads-u-margin-bottom--2p5" data-testid="form-title">
          {formConfig.title}
        </h1>
        {subTitle && (
          <div className="schemaform-subtitle" data-testid="form-subtitle">
            {subTitle}
          </div>
        )}
      </div>
      {showAnnouncements && <Announcements />}
      {showLoadingIndicator && <va-loading-indicator set-focus />}
      {!showLoadingIndicator && (
        <>
          {loggedIn && isUserLOA3 && authenticatedUI}
          {(isLoggedOut || !isLoggedIn || isUserLOA1) && unAuthenticatedUI()}
        </>
      )}
    </div>
  );
};

IntroductionPage.propTypes = {
  toggleLoginModal: PropTypes.func.isRequired,
  isLoggedOut: PropTypes.bool,
  isUserLOA1: PropTypes.bool,
  isUserLOA3: PropTypes.bool,
  loggedIn: PropTypes.bool,
  profile: PropTypes.shape({
    userFullName: PropTypes.shape({
      first: PropTypes.string,
      middle: PropTypes.string,
      last: PropTypes.string,
    }),
    dob: PropTypes.string,
    gender: PropTypes.string,
  }),
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      formId: PropTypes.string,
      title: PropTypes.string,
      subTitle: PropTypes.string,
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.shape({}),
      downtime: PropTypes.shape({}),
    }),
    formData: PropTypes.object,
    setFormData: PropTypes.func,
    pathname: PropTypes.string,
    pageList: PropTypes.array,
  }),
  showLoadingIndicator: PropTypes.bool,
  signInServiceName: PropTypes.string,
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

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: () => dispatch(toggleLoginModalAction(true)),
  setFormData: setData,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(IntroductionPage));
