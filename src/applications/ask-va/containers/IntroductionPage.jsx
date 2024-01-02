import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormTitle from '@department-of-veterans-affairs/platform-forms-system/FormTitle';
import { getNextPagePath } from '@department-of-veterans-affairs/platform-forms-system/routing';
import * as userNavActions from '@department-of-veterans-affairs/platform-site-wide/actions';
import {
  isLoggedIn,
  selectProfile,
} from '@department-of-veterans-affairs/platform-user/selectors';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import recordEvent from 'platform/monitoring/record-event';
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
    <article className="schemaform-intro">
      {/* TODO: Add breadcrumbs  - Ticket #228 */}
      <FormTitle title={formConfig.title} subTitle={formConfig.subTitle} />
      <p className="schemaform-subtitle vads-u-font-size--lg vads-u-margin-bottom--4">
        You should receive a response within 7 business days.
      </p>

      {loggedIn ? (
        <>
          <p className="vads-u-margin-top--2">
            <Link to={getStartPage}>Create new question</Link>
          </p>
          <DashboardCards />
        </>
      ) : (
        <>
          <va-alert
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
              <va-button
                primary-alternate
                text="Sign in or create an account"
                onClick={() => toggleLoginModal(true, 'cta-form')}
              />
            </div>
          </va-alert>
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
          </div>
        </>
      )}

      <h2>Check the status of your question</h2>
      <p className="vads-u-margin--0">Reference number</p>
      <VaSearchInput label="Reference number" />

      {/* <SaveInProgressIntro
        headingLevel={2}
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        pageList={pageList}
        startText="Start the Application"
      >
        Please complete the XX-230 form to apply for ask the va test.
      </SaveInProgressIntro>
      <DashboardCards /> */}
      {/* <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        {loggedIn ? profile.userFullName.first : 'Hello'}, follow the steps
        below to apply for ask the va test.
      </h2>
      <va-process-list>
        <li>
          <h3>Prepare</h3>
          <h4>To fill out this application, you’ll need your:</h4>
          <ul>
            <li>Social Security number (required)</li>
          </ul>
          <p>
            <strong>What if I need help filling out my application?</strong> An
            accredited representative, like a Veterans Service Officer (VSO),
            can help you fill out your claim.{' '}
            <a href="/disability-benefits/apply/help/index.html">
              Get help filing your claim
            </a>
          </p>
        </li>
        <li>
          <h3>Apply</h3>
          <p>Complete this ask the va test form.</p>
          <p>
            After submitting the form, you’ll get a confirmation message. You
            can print this for your records.
          </p>
        </li>
        <li>
          <h3>VA Review</h3>
          <p>
            We process claims within a week. If more than a week has passed
            since you submitted your application and you haven’t heard back,
            please don’t apply again. Call us at.
          </p>
        </li>
        <li>
          <h3>Decision</h3>
          <p>
            Once we’ve processed your claim, you’ll get a notice in the mail
            with our decision.
          </p>
        </li>
      </va-process-list>
      <SaveInProgressIntro
        buttonOnly
        headingLevel={2}
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        pageList={pageList}
        startText="Start the Application"
      />
      <p />
      <va-omb-info res-burden={30} omb-number="XX3344" exp-date="12/31/24" /> */}
    </article>
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
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.shape({}),
      subTitle: PropTypes.string,
      title: PropTypes.string,
    }),
    formData: PropTypes.shape({}),
    pathname: PropTypes.string,
    pageList: PropTypes.array,
  }),
};

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
    profile: selectProfile(state),
  };
}

const mapDispatchToProps = {
  toggleLoginModal: userNavActions.toggleLoginModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);
