import {
  VaAlert,
  VaButton,
  VaSearchInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormTitle from '@department-of-veterans-affairs/platform-forms-system/FormTitle';
import { getNextPagePath } from '@department-of-veterans-affairs/platform-forms-system/routing';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import { toggleLoginModal as toggleLoginModalAction } from '@department-of-veterans-affairs/platform-site-wide/actions';
import {
  isLoggedIn,
  selectProfile,
} from '@department-of-veterans-affairs/platform-user/selectors';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro'; // @ path now working
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import DashboardCards from './DashboardCards';

const IntroductionPage = props => {
  const { route, loggedIn, toggleLoginModal } = props;
  const { formConfig, pageList, pathname, formData } = route;

  const getStartPage = () => {
    const data = formData || {};
    if (pathname) return getNextPagePath(pageList, data, pathname);
    return pageList[1].path;
  };

  const handleClick = () => {
    recordEvent({ event: 'no-login-start-form' });
  };

  useEffect(
    () => {
      focusElement('.va-nav-breadcrumbs-list');
    },
    [props],
  );

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
                onClick={toggleLoginModal}
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
            <VaSearchInput label="Reference number" />
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
