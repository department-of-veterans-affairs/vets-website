import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { focusElement } from '../../../../platform/utilities/ui';
import FormTitle from 'us-forms-system/lib/js/components/FormTitle';
import OMBInfo from '@department-of-veterans-affairs/formation/OMBInfo';
import SaveInProgressIntro, { introActions, introSelector } from '../../../../platform/forms/save-in-progress/SaveInProgressIntro';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="GI Bill® School Feedback Tool"/>
        <p>If you have an issue or complaint about a school or training facility that receives GI Bill benefits, you can submit feedback to VA.</p>
        <p>You can choose to submit feedback anonymously or on behalf of someone else. We’ll share any information you provide with the schools. If you submit feedback on behalf of someone, we’ll share only your information with the school, and not the person you’re submitting on behalf of.</p>
        <p>Get started right now by filling out a short form. Follow the steps below.</p>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <div><h5>Prepare</h5></div>
              <div><h6>To fill out this form, you’ll need to:</h6></div>
              <ul>
                <li>Provide your school’s information and address.</li>
                <li>Tell us the education benefits you’re using.</li>
                <li>Give us your feedback. Please provide as much detail as possible, so we understand your issue or complaint.</li>
                <li>Let us know how you think we could resolve your issue.</li>
                <li>Provide your email address if you want us to get in touch with you directly</li>
              </ul>
            </li>
            <li className="process-step list-two">
              <div><h5>Submit Your Feedback</h5></div>
              <p>Fill out and submit this feedback form.</p>
            </li>
            <li className="process-step list-three">
              <div><h5>VA Review</h5></div>
              <p>We’ll review your feedback and then send it to the school. We may contact you if we need more information from you.</p>
              <p>Feedback that isn’t related to VA education benefits may be sent to another agency for review. We’ll get back to you within 45 days to let you know how we’re handling your feedback.</p>
            </li>
            <li className="process-step list-four">
              <div><h5>School Review</h5></div>
              <p>The school will review your feedback and send us their response.</p>
            </li>
            <li className="process-step list-five">
              <div><h5>VA Follow Up</h5></div>
              <p>We’ll send you the school’s response to your feedback and ask you if their response resolves your issue.
In some cases, the school may also get in touch with you directly to discuss your feedback.</p>
            </li>
          </ol>
        </div>
        <SaveInProgressIntro
          buttonOnly
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Submit Your Feedback"
          {...this.props.saveInProgressActions}
          {...this.props.saveInProgress}/>
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={5} ombNumber="2900-0797" expDate="12/31/2018"/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    saveInProgress: introSelector(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    saveInProgressActions: bindActionCreators(introActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IntroductionPage);

export { IntroductionPage };
