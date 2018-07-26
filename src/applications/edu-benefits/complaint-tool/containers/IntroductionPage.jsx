import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { focusElement } from '../../../../platform/utilities/ui';
import FormTitle from 'us-forms-system/lib/js/components/FormTitle';
import SaveInProgressIntro, { introActions, introSelector } from '../../../../platform/forms/save-in-progress/SaveInProgressIntro';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="GI Bill® School Feedback Tool"/>
        <p>You can submit feedback to us if your GI Bill school isn’t following the Principles of Excellence guidelines or if you have any other concerns or issues you’d like to raise with us. The Principles of Excellence program requires schools to follow certain guidelines in order to get federal funding through the GI Bill.</p>
        <p>You can choose to submit feedback anonymously or on behalf of someone else. Any feedback sent in anonymously isn’t shared with schools or employers.</p>
        <p>Get started right now by filling out a short form. Follow the steps below.</p>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <div><h5>Prepare</h5></div>
              <div><h6>To fill out this form, you’ll need to:</h6></div>
              <ul>
                <li>Enter your school information and address</li>
                <li>Tell us which education benefit you’re using</li>
                <li>Give us your feedback and how you think we could make things better. (1,000 characters maximum)</li>
                <li>Provide your email if you want us to get back to you</li>
              </ul>
            </li>
            <li className="process-step list-two">
              <div><h5>Submit Your Feedback</h5></div>
              <p>Fill out and submit this feedback form.</p>
            </li>
            <li className="process-step list-three">
              <div><h5>VA Review</h5></div>
              <p>We review feedback in the order we receive it. We may contact you if we need more information from you.</p>
              <p>If we need to get in touch with you, we’ll contact you from an email that will look like this: process.vbavaco@va.gov.</p>
            </li>
            <li className="process-step list-four">
              <div><h5>VA Follow Up</h5></div>
              <p>We’ll get back to you within 45 days to let you know how we’re handling your feedback and if we’ve had any communication with your school. Feedback that isn’t related to VA education benefits may be sent to another agency for review.</p>
            </li>
            <li className="process-step list-five">
              <div><h5>School Follow Up</h5></div>
              <p>The school will review your feedback. We’ll send you the school’s response and ask you if you think their response resolves your issue. In some cases, the school may get in touch with you directly to discuss your feedback.</p>
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
