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
       <FormTitle title="GI Bill School Complaint Tool"/>
       <p>If you believe your school or employer isn’t following the Principles of Excellence guidelines, you can file a complaint. This program requires schools to follow certain guidelines in order to get federal funding through the GI Bill.</p>
       <p><a href="https://www.benefits.va.gov/gibill/principles_of_excellence.asp">Learn more about the Principles of Excellence program.</a></p>
       <p>You can file a complaint yourself, anonymously, or on behalf of someone else. Any complaints sent in anonymously aren’t shared with schools or employers. You’ll need to fill out a short form to submit your complaint. You can get started right now.</p>
       <h4>Follow the steps below to file and track your complaint:</h4>
       <div className="process schemaform-process">
         <ol>
           <li className="process-step list-one">
             <div><h5>Prepare</h5></div>
             <div><h6>To fill out this application, you’ll need to:</h6></div>
             <ul>
               <li>Enter your school information and address</li>
               <li>Tell us which education benefit you're using</li>
               <li>Give us your feedback and how you think we could make things better (1,000 characters maximum)</li>
               <li>Provide your email if you want us to get back to you</li>
             </ul>
           </li>
           <li className="process-step list-two">
             <div><h5>File Your Complaint</h5></div>
             <p>Complete this application.</p>
             <p>Note: You might want to type up your feedback in a Word document first, then copy and paste it into the feedback tool’s text box</p>
           </li>
           <li className="process-step list-three">
             <div><h5>VA Review</h5></div>
             <p>We process claims in the order we recieve them. We may contact you if we need more information from you.</p>
           </li>
           <li className="process-step list-four">
             <div><h5>Follow Up</h5></div>
             <p>We'll let you know if we have any communication with your school about your feedback. We suggest that you add __@va.gov to your email contact list to make sure you get messages that may require a quick response from you.</p>
           </li>
         </ol>
       </div>
       <SaveInProgressIntro
         buttonOnly
         messages={this.props.route.formConfig.savedFormMessages}
         pageList={this.props.route.pageList}
         startText="File Your Complaint"
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
