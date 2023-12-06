import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { isLoggedIn, selectProfile } from 'platform/user/selectors';
import DashboardCards from './DashboardCards';

const IntroductionPage = props => {
  const { route, loggedIn, profile } = props;
  const { formConfig, pageList } = route;

  useEffect(
    () => {
      focusElement('.va-nav-breadcrumbs-list');
    },
    [props],
  );

  return (
    <article className="schemaform-intro">
      <FormTitle title="Ask VA" subtitle="Equal to VA Form XX-230 (Ask VA)" />
      <SaveInProgressIntro
        headingLevel={2}
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        pageList={pageList}
        startText="Start the Application"
      >
        Please complete the XX-230 form to apply for ask the va test.
      </SaveInProgressIntro>
      <DashboardCards />
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
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
      <va-omb-info res-burden={30} omb-number="XX3344" exp-date="12/31/24" />
    </article>
  );
};

IntroductionPage.propTypes = {
  profile: PropTypes.shape({
    userFullName: PropTypes.shape({
      first: PropTypes.string,
      middle: PropTypes.string,
      last: PropTypes.string,
    }),
    dob: PropTypes.string,
    gender: PropTypes.string,
  }),
  loggedIn: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
    profile: selectProfile(state),
  };
}

export default connect(mapStateToProps)(IntroductionPage);
