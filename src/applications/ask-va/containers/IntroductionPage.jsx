import {
  VaAlertSignIn,
  VaButton,
  VaSearchInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { getNextPagePath } from '@department-of-veterans-affairs/platform-forms-system/routing';
import {
  isLoggedIn,
  isProfileLoading,
  selectProfile,
} from '@department-of-veterans-affairs/platform-user/selectors';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';
import { toggleLoginModal as toggleLoginModalAction } from '~/platform/site-wide/user-nav/actions';
import { envUrl } from '../constants';
import {
  inProgressOrReopenedIcon,
  newIcon,
  successIcon,
} from '../utils/helpers';
import DashboardCards from './DashboardCards';

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
  const { route, toggleLoginModal, loggedIn, showLoadingIndicator } = props;
  const { formConfig, pageList, pathname, formData } = route;
  const [inquiryData, setInquiryData] = useState(false);
  const [searchReferenceNumber, setSearchReferenceNumber] = useState('');
  const [hasError, setHasError] = useState(false);
  const showSignInModal = () => {
    toggleLoginModal(true, 'ask-va', true);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (
      params.get('showSignInModal') === 'true' &&
      !loggedIn &&
      !showLoadingIndicator
    ) {
      showSignInModal();
    }
  });

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

  const getApiData = url => {
    return apiRequest(url)
      .then(res => {
        setInquiryData(res.data);
      })
      .catch(() => setHasError(true));
  };

  const handleSearchByReferenceNumber = async () => {
    const url = `${envUrl}/ask_va_api/v0/inquiries/${searchReferenceNumber}/status`;
    await getApiData(url);
  };

  const handleSearchInputChange = async e => {
    const searchInputValue = e.target.value;
    setSearchReferenceNumber(searchInputValue);
  };

  const questionStatus = () => {
    if (hasError) {
      return (
        <>
          <p>
            We didn’t find a question with reference number "
            <span className="vads-u-font-weight--bold">
              {searchReferenceNumber}
            </span>
            ." Check your reference number and try again.
          </p>
          <p>
            If it still doesn’t work, ask the same question again and include
            your original reference number.
          </p>
        </>
      );
    }

    if (inquiryData?.attributes?.status) {
      const { status } = inquiryData.attributes;
      return (
        <>
          <h3 className="vads-u-font-weight--normal vads-u-font-size--base vads-u-font-family--sans vads-u-border-bottom--2px vads-u-border-color--gray-light vads-u-padding-bottom--2">
            Showing the status for reference number "
            <span className="vads-u-font-weight--bold">
              {searchReferenceNumber}
            </span>
            "
          </h3>
          <p>
            <span className="vads-u-font-weight--bold">Status: </span> {status}{' '}
            {status === 'Solved' && successIcon}
            {status === 'New' && newIcon}
            {status === 'In progress' && inProgressOrReopenedIcon}
            {status === 'Reopened' && inProgressOrReopenedIcon}
          </p>
          <div className="vads-u-border-left--5px vads-u-border-color--green-light vads-u-padding--0p5">
            {status === 'Solved' && (
              <p className="vads-u-margin-left--2">
                We either answered your question or didn’t have enough
                information to answer your question. If you need more help, ask
                a new question.
              </p>
            )}
            {status === 'New' && (
              <p className="vads-u-margin-left--2">
                We received your question. We’ll review it soon.
              </p>
            )}
            {status === 'In progress' && (
              <p className="vads-u-margin-left--2">
                We’re reviewing your question.
              </p>
            )}
            {status === 'Reopened' && (
              <p className="vads-u-margin-left--2">
                We received your reply. We’ll respond soon.
              </p>
            )}
          </div>
        </>
      );
    }

    return null;
  };

  const unAuthenticatedUI = (
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
        You need to sign in to ask a question about yourself, a family member or
        another Veteran. This form takes about 10 to 15 minutes to complete.
      </p>
      <p className="vads-u-margin-bottom--1">
        Signing in also lets you track your question and read a reply from VA
        when it’s ready.
      </p>

      <VaAlertSignIn variant="signInRequired" visible headingLevel={4}>
        <span slot="SignInButton">
          <VaButton
            text="Sign in or create an account"
            onClick={showSignInModal}
          />
        </span>
      </VaAlertSignIn>

      <h3 className="vads-u-margin-top--6">If you need general information</h3>
      <p className="vads-u-margin-bottom--1">
        We recommend that you use the{' '}
        <Link href="https://www.va.gov/contact-us/virtual-agent/">chatbot</Link>{' '}
        or review <Link href="https://www.va.gov/resources/">FAQs</Link> to find
        general information more quickly. Otherwise, there are some questions
        you can ask without signing in. This form takes about 2 to 5 minutes to
        complete.
      </p>
      <Link className="vads-c-action-link--blue" to={getStartPage}>
        Start your question without signing in
      </Link>

      <h2 slot="headline">Only use Ask VA for non-urgent needs</h2>
      <h3 className="vads-u-margin-top--3">
        If you need help now, use one of these urgen communication options
      </h3>
      <ul>
        <li>
          <strong>If you’re in crisis or having thoughts of suicide,</strong>{' '}
          connect with our Veterans Crisis Line. We offer confidential support
          anytime, day or night.{' '}
          <div className="vads-u-margin-top--1 vads-u-margin-bottom--1">
            <va-button
              secondary="true"
              text="Connect with the Veterans Crisis Line"
              href="https://www.veteranscrisisline.net/"
            />
          </div>
        </li>
        <li>
          <strong>If you think your life or health is in danger,</strong> call{' '}
          <va-telephone contact="911" message-aria-describedby="9 1 1" /> or go
          to the nearest emergency room.
        </li>
      </ul>

      <h2>Check the status of your question</h2>
      <p className="vads-u-margin--0">Enter your reference number</p>
      <VaSearchInput
        label="Reference number"
        value={searchReferenceNumber}
        onInput={handleSearchInputChange}
        onSubmit={handleSearchByReferenceNumber}
        uswds
      />
      {questionStatus()}
    </>
  );

  const authenticatedUI = (
    <>
      <p>This form takes about 2 to 15 minutes to complete.</p>
      <div className="vads-u-margin-top--2 vads-u-margin-bottom--4">
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
        // continueMsg="If you're on a public computer, please sign out of your account before you leave so your information is secure."
        formConfig={formConfig}
        messages={route.formConfig.savedFormMessages}
        prefillEnabled={formConfig.prefillEnabled}
        pageList={pageList}
        startText="Ask a new question"
        className="vads-u-margin--0"
        verifiedPrefillAlert={VerifiedAlert}
      />
      <DashboardCards />
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
      {showLoadingIndicator && <va-loading-indicator set-focus />}
      {!showLoadingIndicator && (
        <>
          {loggedIn && authenticatedUI}
          {!loggedIn && unAuthenticatedUI}
        </>
      )}
    </div>
  );
};

IntroductionPage.propTypes = {
  toggleLoginModal: PropTypes.func.isRequired,
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
};

function mapStateToProps(state) {
  return {
    formData: state.form?.data || {},
    loggedIn: isLoggedIn(state),
    profile: selectProfile(state),
    showLoadingIndicator: isProfileLoading(state),
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
