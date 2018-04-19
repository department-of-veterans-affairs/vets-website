import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { focusElement } from '../../../../platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/jean-pants/OMBInfo';
import FormTitle from '../../../common/schemaform/components/FormTitle';
import SaveInProgressIntro, { introActions, introSelector } from '../../../common/schemaform/save-in-progress/SaveInProgressIntro';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply for declaration of dependents"/>
        <p>Equal to VA Form 21-686c (Application for Declaration of Status of Dependents).</p>
        <SaveInProgressIntro
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the Declaration of Dependents Application"
          {...this.props.saveInProgressActions}
          {...this.props.saveInProgress}>
          Please complete the 686 form to apply for declaration of status of dependents.
        </SaveInProgressIntro>
        <h4>Follow the steps below to apply for declaration of status of dependents.</h4>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <div><h5>Prepare</h5></div>
              <div><h6>When you apply, besure to have these on hand:</h6></div>
              <ul>
                <li>Social Security number</li>
                <li>Current and previous marriage details</li>
                <li>Unmarried child’s name, Social Security number, date of birth, and school information</li>
              </ul>
              <div><h6>If you're claiming a dependent who's over the age of 18 and attending school, you'll also need:</h6></div>
              <ul>
                <li>To turn in a completed Request for Approval of School Attendance (VA Form 21-674).</li>
                <div>
                  <a href="https://www.vba.va.gov/pubs/forms/VBA-21-674-ARE.pdf">Download VA Form 21-674</a>
                </div>
              </ul>
              <div><h6>What if I need help filling out my application?</h6></div>
              <p>An accredited representative, like a Veterans Service Officer (VSO), can help you fill out your claim.</p>
              <div><a href="/disability-benefits/apply/help/index.html">Get help filing your claim</a></div>
              <br/>
              <SaveInProgressIntro
                messageOnly
                alertMessage={
                  {
                    title: 'Why do I need to declare a dependent?',
                    message: 'You need to let VA know when something changes in the status of your dependents that could affect their eligibility for benefits. Changes in status could include in the birth or adoption of a child, if you get married or divorced, if your child becomes seriously disabled, or if your child is over 18 years old and not attending school.'
                  }
                }
                pageList={this.props.route.pageList}
                {...this.props.saveInProgressActions}
                {...this.props.saveInProgress}/>
            </li>
            <li className="process-step list-two">
              <div><h5>Apply</h5></div>
              <p>Complete this declaration of status of dependents form.</p>
              <p>After submitting the form, you’ll get a confirmation message. You can print this for your records.</p>
            </li>
            <li className="process-step list-three">
              <div><h5>VA Review</h5></div>
              <p>We process applications in the order we receive them. We may contact you if we have questions or need more information.</p>
            </li>
            <li className="process-step list-four">
              <div><h5>Decision</h5></div>
              <p>You'll get a notice in the mail once we've processed your claim.</p>
            </li>
          </ol>
        </div>
        <SaveInProgressIntro
          buttonOnly
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the Declaration of Dependents Application"
          {...this.props.saveInProgressActions}
          {...this.props.saveInProgress}/>
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={15} ombNumber="2900-0043" expDate="06/30/2020"/>
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
