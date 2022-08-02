import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import recordEvent from 'platform/monitoring/record-event';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { focusElement } from 'platform/utilities/ui';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { isEmptyAddress } from 'platform/forms/address/helpers';
import { selectVAPContactInfoField } from '@@vap-svc/selectors';
import { FIELD_NAMES } from '@@vap-svc/constants';
import { WIZARD_STATUS_NOT_STARTED } from 'platform/site-wide/wizard';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { isLoggedIn, selectProfile } from 'platform/user/selectors';

import { FETCH_CONTESTABLE_ISSUES_INIT } from '../actions';

import {
  BASE_URL,
  SUPPLEMENTAL_CLAIM_URL,
  FACILITY_LOCATOR_URL,
  GET_HELP_REVIEW_REQUEST_URL,
} from '../constants';
import {
  showContestableIssueError,
  showHasEmptyAddress,
} from '../content/contestableIssueAlerts';
import NeedsToVerify from '../components/NeedsToVerify';
import { checkContestableIssueError } from '../utils/helpers';

export class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('h1');
    scrollToTop();
  }

  getCallToActionContent = ({ last } = {}) => {
    const {
      loggedIn,
      isVerified,
      route,
      contestableIssues,
      delay = 250,
      location,
    } = this.props;

    if (loggedIn && !isVerified) {
      return <NeedsToVerify pathname={location.basename} />;
    }

    if (checkContestableIssueError(contestableIssues?.error)) {
      return showContestableIssueError(contestableIssues, delay);
    }

    if (
      loggedIn &&
      ((contestableIssues?.status || '') === '' ||
        contestableIssues?.status === FETCH_CONTESTABLE_ISSUES_INIT)
    ) {
      return (
        <va-loading-indicator
          set-focus
          message="Loading your previous decisions..."
        />
      );
    }

    const { formId, prefillEnabled, savedFormMessages } = route.formConfig;
    return (
      <SaveInProgressIntro
        formId={formId}
        headingLevel={2}
        prefillEnabled={prefillEnabled}
        messages={savedFormMessages}
        pageList={route.pageList}
        startText="Start the Request for a Higher-Level Review"
        gaStartEventName="decision-reviews-va20-0996-start-form"
        ariaDescribedby="main-content"
        hideUnauthedStartLink
        testActionLink
        buttonOnly={last}
      />
    );
  };

  restartWizard = () => {
    this.setWizardStatus(WIZARD_STATUS_NOT_STARTED);
    recordEvent({ event: 'howToWizard-start-over' });
  };

  render() {
    const { loggedIn, hasEmptyAddress } = this.props;
    const pageTitle = 'Request a Higher-Level Review with VA Form 20-0996';
    const subTitle = 'VA Form 20-0996 (Higher-Level Review)';

    // check if user has address
    if (loggedIn && hasEmptyAddress) {
      return (
        <article className="schemaform-intro">
          <FormTitle title={pageTitle} subTitle={subTitle} />
          {showHasEmptyAddress}
        </article>
      );
    }

    return (
      <article className="schemaform-intro">
        <FormTitle title={pageTitle} subTitle={subTitle} />
        {this.getCallToActionContent()}

        <h2 id="main-content" className="vads-u-font-size--h3">
          What’s a Higher-Level Review?
        </h2>
        <p>
          If you or your representative disagree with VA’s decision on your
          claim, you can request a Higher-Level Review. With a Higher-Level
          Review, a senior reviewer will take a new look at your case and the
          evidence you already provided. The reviewer will decide whether the
          decision can be changed based on a difference of opinion or an error.
        </p>
        <h2 className="vads-u-font-size--h3">
          You can’t submit new evidence with a Higher-Level Review
        </h2>
        <p>
          The senior reviewer will only review the evidence you already
          provided. If you have new and relevant evidence, you can{' '}
          <a href={SUPPLEMENTAL_CLAIM_URL}>file a Supplemental Claim</a>.
        </p>
        <div className="process schemaform-process">
          <h2 className="vads-u-font-size--h3">
            Follow the steps below to request a Higher-Level Review.
          </h2>
          <p className="vads-u-margin-top--2">
            If you don’t think this is the right form for you,{' '}
            <a
              href={`${BASE_URL}/start`}
              className="va-button-link"
              onClick={this.restartWizard}
            >
              go back and answer questions again
            </a>
            .
          </p>
          <ol>
            <li className="process-step list-one">
              <h3 className="vads-u-font-size--h4">Prepare</h3>
              <p>To fill out this application, you’ll need your:</p>
              <ul>
                <li>Primary address</li>
                <li>
                  List of issues you disagree with and the VA decision date for
                  each
                </li>
                <li>Representative’s contact information (optional)</li>
              </ul>
              <p>
                <strong>What if I need help with my application?</strong>
              </p>
              <p>
                If you need help requesting a Higher-Level Review, you can
                contact a VA regional office and ask to speak to a
                representative. To find the nearest regional office, please call{' '}
                <va-telephone contact={CONTACTS.VA_BENEFITS} />
                {' or '}
                <a href={FACILITY_LOCATOR_URL}>
                  visit our facility locator tool
                </a>
                .
              </p>
              <p>
                A Veterans Service Organization or VA-accredited attorney or
                agent can also help you request a decision review.
              </p>
              <a href={GET_HELP_REVIEW_REQUEST_URL}>
                Get help requesting a decision review
              </a>
              .
            </li>
            <li className="process-step list-two">
              <h3 className="vads-u-font-size--h4">Apply</h3>
              <p>
                Complete this Higher-Level Review form. After submitting the
                form, you’ll get a confirmation message. You can print this for
                your records.
              </p>
            </li>
            <li className="process-step list-three">
              <h3 className="vads-u-font-size--h4">VA Review</h3>
              <p>
                Our goal for completing a Higher-Level Review is 125 days. A
                review might take longer if we need to get records or schedule a
                new exam to correct an error.
              </p>
            </li>
            <li className="process-step list-four">
              <h3 className="vads-u-font-size--h4">Decision</h3>
              <p>
                Once we’ve processed your claim, you’ll get a notice in the mail
                with our decision.
              </p>
            </li>
          </ol>
        </div>

        {this.getCallToActionContent({ last: true })}

        <div className="omb-info--container vads-u-padding-left--0">
          <OMBInfo resBurden={15} ombNumber="2900-0862" expDate="04/30/2024" />
        </div>
      </article>
    );
  }
}

IntroductionPage.propTypes = {
  contestableIssues: PropTypes.shape({
    issues: PropTypes.array,
    status: PropTypes.string,
    error: PropTypes.string,
    legacyCount: PropTypes.number,
    benefitType: PropTypes.string,
  }),
  delay: PropTypes.number,
  hasEmptyAddress: PropTypes.bool,
  isVerified: PropTypes.bool,
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
  loggedIn: PropTypes.bool,
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      formId: PropTypes.string,
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.shape({}),
    }),
    pageList: PropTypes.array,
  }),
  savedForms: PropTypes.array,
};

function mapStateToProps(state) {
  const { form, contestableIssues } = state;
  const profile = selectProfile(state);
  return {
    form,
    loggedIn: isLoggedIn(state),
    savedForms: profile.savedForms,
    isVerified: profile.verified,
    contestableIssues,
    hasEmptyAddress: isEmptyAddress(
      selectVAPContactInfoField(state, FIELD_NAMES.MAILING_ADDRESS),
    ),
  };
}

const mapDispatchToProps = {
  toggleLoginModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);
