import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import CallToActionWidget from 'platform/site-wide/cta-widget';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { focusElement } from 'platform/utilities/ui';

import { BASE_URL } from '../constants';

class IntroductionPage extends React.Component {
  componentDidMount() {
    if (
      !this.hasSavedForm() &&
      !window.location.pathname.endsWith('/introduction')
    ) {
      window.location.replace(`${BASE_URL}/introduction`);
    }

    focusElement('.va-nav-breadcrumbs-list');
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

  render() {
    const { route } = this.props;
    const { formConfig } = route;
    return (
      <article className="schemaform-intro">
        <FormTitle title="Request a Higher-Level Review" />
        <p>Equal to VA Form 20-0996 (Higher-Level Review).</p>

        <CallToActionWidget appId="higher-level-review">
          <SaveInProgressIntro
            downtime={formConfig.downtime}
            formId={formConfig.formId}
            prefillEnabled={formConfig.prefillEnabled}
            messages={formConfig.savedFormMessages}
            pageList={route.pageList}
            startText="Start the Request for a Higher-Level Review"
          >
            Please complete the 20-0996 form to apply for Higher-Level Review.
          </SaveInProgressIntro>
        </CallToActionWidget>
        <p>
          After you click the button to start the Higher-Level Review
          application, you’ll need to opt out (withdraw) from the old appeals
          process. This switch triggers us to formally withdraw your claim or
          appeal from the old appeal system and process it under the new system.
          Once you opt in to the new appeals process, the decision is permanent
          and you can’t return to the old appeals process.
        </p>
        <aside className="process schemaform-process">
          <h4>Follow the steps below to Request a Higher-Level Review.</h4>
          <br />
          <ol>
            <li className="process-step list-one">
              <h5>Prepare</h5>
              <p>To fill out this application, you’ll need your:</p>
              <ul>
                <li>
                  Primary address (or forwarding address if you'll be moving
                  soon)
                </li>
                <li>
                  List of issues you disagree with and the VA decision date for
                  each
                </li>
                <li>Representative's contact information (optional)</li>
              </ul>
              <p>
                When you request a Higher-Level Review, you won't be able to
                submit new evidence. If you have new evidence to submit, you'll
                need to select another review option.
              </p>
              <p>
                <a href="/decision-reviews">Learn more about review options</a>.
              </p>
              <p>
                <strong>What if I need help filling out my application?</strong>
              </p>
              <p>
                If you need help requesting a Higher-Level Review, you can
                contact a VA regional office and ask to speak to a counselor. To
                find the nearest regional office, please call{' '}
                <a href="tel:1-800-827-1000">800-827-1000</a> or{' '}
                <a href="/find-locations">visit our facility locator tool</a>.
              </p>
              <p>
                An accredited representative, like a Veterans Service Officer
                (VSO), can help you request a decision review.
              </p>
              <a href="/decision-reviews/get-help-with-review-request">
                Get help requesting a decision review
              </a>
              .
            </li>
            <li className="process-step list-two">
              <h5>Apply</h5>
              <p>
                Complete this Request for Higher-Level Review form. After
                submitting the form, you’ll get a confirmation message. You can
                print this form for your records.
              </p>
            </li>
            <li className="process-step list-three">
              <h5>VA Review</h5>
              <p>
                Our goal for completing a Higher-Level Review is 125 days. A
                review might take longer if we need to get records or schedule a
                new exam to correct the error.
              </p>
            </li>
            <li className="process-step list-four">
              <h5>Decision</h5>
              <p>
                Once we’ve processed your claim, you’ll get a notice in the mail
                with our decision.
              </p>
            </li>
          </ol>
        </aside>
        <CallToActionWidget appId="higher-level-review">
          <SaveInProgressIntro
            downtime={formConfig.downtime}
            formId={formConfig.formId}
            prefillEnabled={formConfig.prefillEnabled}
            messages={formConfig.savedFormMessages}
            pageList={route.pageList}
            startText="Start the Request for a Higher-Level Review"
          >
            Please complete the 20-0996 form to apply for Higher-Level Review.
          </SaveInProgressIntro>
        </CallToActionWidget>
        {/* TODO: Remove inline style after I figure out why
          .omb-info--container has a left padding */}
        <div
          className="omb-info--container vads-u-padding-left--0"
          role="presentation"
        >
          <OMBInfo resBurden={15} ombNumber="2900-0862" expDate="02/28/2022" />
        </div>
      </article>
    );
  }
}

function mapStateToProps(state) {
  const { form, user } = state;
  return {
    form,
    user,
  };
}

const mapDispatchToProps = {
  toggleLoginModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);

export { IntroductionPage };
