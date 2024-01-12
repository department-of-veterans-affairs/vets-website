import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormTitle from '@department-of-veterans-affairs/platform-forms-system/FormTitle';
import { getNextPagePath } from 'platform/forms-system/src/js/routing';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import recordEvent from 'platform/monitoring/record-event';
import * as userNavActions from 'platform/site-wide/user-nav/actions';
import { isLoggedIn, selectProfile } from 'platform/user/selectors';
import { focusElement } from 'platform/utilities/ui';
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
      {/* TODO: Add breadcrumbs  - Ticket #228 */}
      <FormTitle title={formConfig.title} subTitle={formConfig.subTitle} />

      {loggedIn ? (
        <>
          <Link className="vads-c-action-link--blue" to={getStartPage}>
            Create new question
          </Link>
          <DashboardCards />
        </>
      ) : (
        <>
          <p className="schemaform-subtitle vads-u-font-size--lg vads-u-margin-bottom--4">
            You should receive a response within 7 business days.
          </p>
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

const mapDispatchToProps = {
  toggleLoginModal: userNavActions.toggleLoginModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);
