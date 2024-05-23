import {
  VaAlert,
  VaButton,
  VaSearchInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormTitle from '@department-of-veterans-affairs/platform-forms-system/FormTitle';
import { getNextPagePath } from '@department-of-veterans-affairs/platform-forms-system/routing';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import {
  isLoggedIn,
  selectProfile,
} from '@department-of-veterans-affairs/platform-user/selectors';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro'; // @ path now working
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { toggleLoginModal as toggleLoginModalAction } from '~/platform/site-wide/user-nav/actions';
import { inProgressOrReopenedIcon, newIcon, successIcon } from '../helpers';
import DashboardCards from './DashboardCards';

const IntroductionPage = props => {
  const { route, loggedIn, toggleLoginModal } = props;
  const { formConfig, pageList, pathname, formData } = route;
  const [inquiryData, setInquiryData] = useState(false);
  const [searchReferenceNumber, setSearchReferenceNumber] = useState(
    'A-20240521-307161',
  );
  const [hasError, setHasError] = useState(false);

  const getStartPage = () => {
    const data = formData || {};
    if (pathname) return getNextPagePath(pageList, data, pathname);
    return pageList[1].path;
  };

  const handleClick = () => {
    recordEvent({ event: 'no-login-start-form' });
  };

  const showSignInModal = () => {
    toggleLoginModal(true, 'askVA');
  };

  useEffect(
    () => {
      focusElement('.va-nav-breadcrumbs-list');
    },
    [props],
  );

  // const getApiData = url => {
  //   return apiRequest(url)
  //     .then(() => {
  //       setInquiryData(res);
  //     })
  //     .catch(() => setHasError(true));
  // };

  const handleSearchByReferenceNumber = () => {
    // const url = `${
    //   environment.API_URL
    // }/inquiries/${searchReferenceNumber}/status`;
    // getApiData(url);
    const mockResponse = {
      id: 12345,
      type: 'inquiryStatus',
      attributes: {
        status: 'New',
        levelOfAuthentication: '18764231182',
      },
    };
    setHasError(false);
    setInquiryData(mockResponse);
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

    if (inquiryData.id && searchReferenceNumber) {
      const { status, levelOfAuthentication } = inquiryData.attributes;
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
                We received your reply. We’ll response soon
              </p>
            )}
          </div>
          {levelOfAuthentication !== 'Unauthenticated' && (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a
              role="button"
              className="vads-c-action-link--green vads-u-margin-top--2"
              // eslint-disable-next-line no-script-url
              href="javascript:void(0)"
              onClick={showSignInModal}
            >
              Sign in to check your application status{' '}
            </a>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <div className="schemaform-intro">
      <FormTitle title={formConfig.title} subTitle={formConfig.subTitle} />

      {loggedIn ? (
        <>
          <Link className="vads-c-action-link--green" to={getStartPage}>
            Ask a new question
          </Link>
          <div className="vads-u-margin-top--5 vads-u-margin-bottom--5">
            <va-accordion
              disable-analytics={{
                value: 'false',
              }}
              open-single
              section-heading={{
                value: 'null',
              }}
              uswds={{
                value: 'true',
              }}
            >
              <va-accordion-item
                header="Only use Ask VA for non-urgent questions"
                id="first"
              >
                <p>
                  It can take up to
                  <strong>7 business days</strong> to get a response.
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
                    <strong>
                      If you think your life or health is in danger,
                    </strong>{' '}
                    call{' '}
                    <va-telephone
                      contact="911"
                      message-aria-describedby="Emergency care contact number"
                    />
                    , or go to the nearest emergency room.
                  </li>
                </ul>
              </va-accordion-item>
            </va-accordion>
          </div>

          <DashboardCards />
        </>
      ) : (
        <>
          <p className="schemaform-subtitle vads-u-font-size--lg vads-u-margin-bottom--4">
            You should receive a response within 7 business days.
          </p>
          <VaAlert
            close-btn-aria-label="Close notification"
            status="continue"
            visible
            uswds
          >
            <h2 id="track-your-status-on-mobile" slot="headline">
              Signing in is required if your question is about education
              benefits and work study or debt
            </h2>
            <div>
              <p className="vads-u-margin-top--0">
                You need to sign in if your question is about education benefits
                and work study or debt.
              </p>
              <VaButton
                primary-alternate
                text="Sign in or create an account"
                onClick={showSignInModal}
              />
            </div>
          </VaAlert>
          <h2 slot="headline">Sign in for the best experience</h2>
          <div>
            <p className="vads-u-margin-top--0">
              Here’s how signing in now helps you:
            </p>
            <ul>
              <li>We can fill in some of you rinformation to save time.</li>
              <li>You can track when your question receives a reply.</li>
              <li>You can review past messages and responses</li>
            </ul>
            <p>
              <strong>Note:</strong> You can sign in after you ask a question,
              but your question won’t be tied to your account.
            </p>
            <SaveInProgressIntro
              buttonOnly
              headingLevel={2}
              prefillEnabled={formConfig.prefillEnabled}
              verifiedPrefillAlert={
                <div>
                  <div className="usa-alert usa-alert-info schemaform-sip-alert">
                    <div className="usa-alert-body">
                      We’ve prefilled some of your information from your
                      account. If you need to correct anything, you can edit the
                      form fields below.
                    </div>
                  </div>
                  <br />
                </div>
              }
              messages={formConfig.savedFormMessages}
              pageList={pageList}
              startText="Start the Application"
              unauthStartText="Sign in or create an account"
              hideUnauthedStartLink
            >
              Please complete the XX-230 form to apply for ask the va test.
            </SaveInProgressIntro>
            <p className="vads-u-margin-top--2">
              <Link onClick={handleClick} to={getStartPage}>
                Continue without signing in
              </Link>
            </p>
            <h2>Check the status of your question</h2>
            <p className="vads-u-margin--0">Reference number</p>
            <VaSearchInput
              label="Reference number"
              value={searchReferenceNumber}
              onInput={handleSearchInputChange}
              onSubmit={handleSearchByReferenceNumber}
              uswds
            />
            {questionStatus()}
          </div>
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
};

function mapStateToProps(state) {
  return {
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
