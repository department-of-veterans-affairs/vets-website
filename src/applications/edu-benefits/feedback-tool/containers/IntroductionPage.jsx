import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { focusElement } from '../../../../platform/utilities/ui';
import FormTitle from 'us-forms-system/lib/js/components/FormTitle';
import OMBInfo from '@department-of-veterans-affairs/formation/OMBInfo';
import SaveInProgressIntro, {
  introActions,
  introSelector,
} from '../../../../platform/forms/save-in-progress/SaveInProgressIntro';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="GI Bill® School Feedback Tool" />
        <p>
          If you have an issue or complaint about a school or training facility
          that’s eligible to receive GI Bill benefits, you can submit feedback
          to VA. You can submit feedback to us if your school isn’t following
          the Principles of Excellence guidelines or if you have any other
          concerns or issues you’d like to raise with us.
        </p>
        <p>
          You can choose to submit your feedback anonymously or on behalf of
          someone else. We share all information with the school, but if you
          submit feedback anonymously we won’t share your name with the school.
        </p>
        <p>
          Get started right now by filling out a short form. Follow the steps
          below.
        </p>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <div>
                <h5>Prepare</h5>
              </div>
              <div>
                <h6>To fill out this form, you’ll need to:</h6>
              </div>
              <ul>
                <li>Provide your school’s name and address.</li>
                <li>Tell us the education benefits you’re using.</li>
                <li>
                  Give us your feedback. Please provide as much detail as
                  possible so we understand your issue or complaint.
                </li>
                <li>Let us know how you think we could resolve your issue.</li>
                <li>
                  Provide your email address if you want us to get in touch with
                  you directly.
                </li>
              </ul>
            </li>
            <li className="process-step list-two">
              <div>
                <h5>Submit Your Feedback</h5>
              </div>
              <p>Fill out and submit this feedback form.</p>
            </li>
            <li className="process-step list-three">
              <div>
                <h5>VA Review</h5>
              </div>
              <p>
                We’ll review your feedback and pass it along to your school for
                their review. Feedback that isn’t related to VA education
                benefits may be sent to another agency for review.
              </p>
              <p>
                We’ll get back to you within 45 days to let you know how we’re
                handling your feedback.
              </p>
            </li>
            <li className="process-step list-four">
              <div>
                <h5>VA Processing</h5>
              </div>
              <p>
                After we get the school’s response to your feedback, we’ll send
                it to you and ask if you think their response resolves your
                issue. In some cases, your school may also get in touch with you
                directly about your feedback.
              </p>
            </li>
          </ol>
        </div>
        <SaveInProgressIntro
          buttonOnly
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Submit Your Feedback"
          {...this.props.saveInProgressActions}
          {...this.props.saveInProgress}
        />
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={15} ombNumber="2900-0797" expDate="12/31/2018" />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    saveInProgress: introSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    saveInProgressActions: bindActionCreators(introActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);

export { IntroductionPage };
