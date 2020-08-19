import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import CallToActionWidget from 'platform/site-wide/cta-widget';
import { focusElement } from 'platform/utilities/ui';

import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { setData } from 'platform/forms-system/src/js/actions';
import { getContestableIssues as getContestableIssuesAction } from '../actions';

import { higherLevelReviewFeature } from '../helpers';
import {
  noContestableIssuesFound,
  showContestableIssueError,
  showWorkInProgress,
} from '../content/contestableIssueAlerts';

export class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
    if (!this.props.contestableIssues?.status) {
      this.props.getContestableIssues();
    }
  }

  componentDidUpdate(prevProps) {
    const { contestableIssues = {} } = this.props;
    if (
      contestableIssues.status !== prevProps.contestableIssues.status &&
      contestableIssues.issues?.length > 0
    ) {
      const { setFormData, form } = this.props;
      setFormData({
        ...form.data,
        contestedIssues: contestableIssues.issues,
      });
    }
  }

  hasSavedForm = () => {
    const { user } = this.props;
    return user?.profile?.savedForms
      .filter(f => moment.unix(f.metadata.expiresAt).isAfter())
      .find(f => f.form === this.props.formId);
  };

  authenticate = e => {
    e.preventDefault();
    this.props.toggleLoginModal(true);
  };

  getCallToActionContent = () => {
    const { route, contestableIssues, allowHlr, testHlr } = this.props;
    // check feature flag
    if (!(allowHlr || testHlr)) {
      return showWorkInProgress;
    }
    const { formConfig } = route;
    if (contestableIssues?.error) {
      return showContestableIssueError(contestableIssues.error.errors);
    }
    return contestableIssues?.issues?.length > 0 ? (
      <SaveInProgressIntro
        formId={formConfig.formId}
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        pageList={route.pageList}
        startText="Start the Request for a Higher-Level Review"
        gaStartEventName="decision-reviews-va20-0996-start-form"
      />
    ) : (
      noContestableIssuesFound
    );
  };

  render() {
    const callToActionContent = this.getCallToActionContent();

    return (
      <article className="schemaform-intro">
        <FormTitle title="Request a Higher-Level Review" />
        <p>Equal to VA Form 20-0996 (Higher-Level Review).</p>

        <CallToActionWidget appId="higher-level-review">
          {callToActionContent}
        </CallToActionWidget>
        <h2 className="vads-u-font-size--h3">What is a Higher-Level Review</h2>
        <p>
          If a Veteran or their representative wants to dispute a decision they
          received on a claim, they can file a Higher-Level Review. When you
          request a Higher-Level Review, you’re asking to have a more senior,
          experience reviewer take a look at your case and the evidence you
          already provided. This more senior person will determine whether the
          decision can be changed based on a difference of opinion or a VA
          error.
        </p>
        <h2 className="vads-u-font-size--h3">You cannot submit new evidence</h2>
        <p>
          The reviewer will only consider the evidence you have already provided
          when reviewing your case. If you have new and relevant evidence, you
          have the{' '}
          <a href="/decision-reviews">
            option to use a different Decision Review lane
          </a>{' '}
          in order to have that new evidence considered.
        </p>
        <div className="process schemaform-process">
          <h3 className="vads-u-font-size--h4">
            Follow the steps below to request a Higher-Level Review.
          </h3>
          <br />
          <ol>
            <li className="process-step list-one">
              <h4 className="vads-u-font-size--h5">Prepare</h4>
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
                When you request a Higher-Level Review, you won’t be able to
                submit new evidence. If you have new evidence to submit, you’ll
                need to select another review option.
              </p>
              <p>
                <a href="/decision-reviews">Learn more about review options</a>.
              </p>
              <p>
                <strong>What if I need help with my application?</strong>
              </p>
              <p>
                If you need help requesting a Higher-Level Review, you can
                contact a VA regional office and ask to speak to a
                representative. To find the nearest regional office, please call{' '}
                <a
                  href="tel:1-800-827-1000"
                  aria-label="8 0 0. 8 2 7. 1 0 0 0."
                  className="nowrap"
                >
                  800-827-1000
                </a>
                {' or '}
                <a href="/find-locations">visit our facility locator tool</a>.
              </p>
              <p>
                A Veterans Service Organization or VA-accredited attorney or
                agen can also help you request a decision review.
              </p>
              <a href="/decision-reviews/get-help-with-review-request">
                Get help requesting a decision review
              </a>
              .
            </li>
            <li className="process-step list-two">
              <h4 className="vads-u-font-size--h5">Apply</h4>
              <p>
                Complete this Higher-Level Review form. After submitting the
                form, you’ll get a confirmation message. You can print this for
                your records.
              </p>
            </li>
            <li className="process-step list-three">
              <h4 className="vads-u-font-size--h5">VA Review</h4>
              <p>
                Our goal for completing a Higher-Level Review is 125 days. A
                review might take longer if we need to get records or schedule a
                new exam to correct the error.
              </p>
            </li>
            <li className="process-step list-four">
              <h4 className="vads-u-font-size--h5">Decision</h4>
              <p>
                Once we’ve processed your claim, you’ll get a notice in the mail
                with our decision.
              </p>
            </li>
          </ol>
        </div>
        <CallToActionWidget appId="higher-level-review">
          {callToActionContent}
        </CallToActionWidget>
        {/* TODO: Remove inline style after I figure out why
          .omb-info--container has a left padding */}
        <div className="omb-info--container vads-u-padding-left--0">
          <OMBInfo resBurden={15} ombNumber="2900-0862" expDate="02/28/2022" />
        </div>
      </article>
    );
  }
}

function mapStateToProps(state) {
  const { form, user, contestableIssues } = state;
  return {
    form,
    user,
    contestableIssues,
    allowHlr: higherLevelReviewFeature(state),
  };
}

const mapDispatchToProps = {
  toggleLoginModal,
  setFormData: setData,
  getContestableIssues: getContestableIssuesAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);
