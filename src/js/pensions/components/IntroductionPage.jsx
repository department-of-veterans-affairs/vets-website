import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { focusElement } from '../../common/utils/helpers';
import OMBInfo from '../../common/components/OMBInfo';
import FormTitle from '../../common/schemaform/FormTitle';
import SaveInProgressIntro, { introActions, introSelector } from '../../common/schemaform/SaveInProgressIntro';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }
  goForward = () => {
    this.props.router.push(this.props.route.pageList[1].path);
  }
  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply for Veterans pension benefits"/>
        <p>Equal to Form 21P-527EZ</p>
        <SaveInProgressIntro
            pageList={this.props.route.pageList}
            resumeOnly
            {...this.props.saveInProgressActions}
            {...this.props.saveInProgress}/>
        <div className="process schemaform-process schemaform-process-sip">
          <ol>
            <li className="process-step list-one">
              <div><h5>Prepare</h5></div>
              <div><h6>To fill out this application, you’ll need your:</h6></div>
              <ul>
                <li>Social Security number or VA file number (required)</li>
                <li>Military history—information like service dates, discharge character, and rank that’s commonly found on the DD214 or other separation documents (required)</li>
                <li>Financial information—and your dependents’ financial information (required)</li>
                <li>Bank account direct deposit information</li>
                <li>Medical information</li>
              </ul>
              <h6>If you’re under 65 years old, you may also need:</h6>
              <ul>
                <li>Work history</li>
                <li>Any medical evidence that supports your claim</li>
              </ul>
              <div className="usa-alert usa-alert-info">
                <div className="usa-alert-body">
                  <h6 className="usa-alert-heading">Fully Developed Claim (FDC) Program</h6><br/>
                  <p>The Fully Developed Claim (FDC) program is the fastest way to get your claim processed and there is no risk for you to participate. With this program, you send in all the evidence, or supporting documents, you have when you file your claim. We can make a decision on your application without asking you for more information.</p>
                  <p><a href="/pension/apply/fully-developed-claim/" target="_blank">Learn more about the FDC Program</a>.</p>
                </div>
              </div>
              <br/>
              <h6>Aid and Attendance and Housebound benefits</h6>
              If you need help with daily activities or you’re housebound, you may qualify for Aid and Attendance and Housebound benefits in addition to your pension benefits.<br/>
              <a href="/pension/aid-attendance-housebound/" target="_blank">Learn more about eligibility</a>.<br/><br/>
              <ul>
                <li>To submit a claim for Aid and Attendance or Housebound benefits in addition to your pension claim, please have your doctor complete an Examination for Housebound Status or Permanent Need for Regular Aid and Attendance (VA Form 21-2680). Turn in the completed form with your claim. <a href="http://www.vba.va.gov/pubs/forms/VBA-21-2680-ARE.pdf" target="_blank">Download VA Form 21-2680</a></li>
                <li>In addition to your claim for Aid and Attendance or Housebound benefits, if you live in a nursing home, please have the nursing home fill out a Request for Nursing Home Information in Connection with Claim for Aid and Attendance (VA Form 21-0779). Turn in the completed form with your claim. <a href="http://www.vba.va.gov/pubs/forms/VBA-21-0779-ARE.pdf" target="_blank">Download VA Form 21-0779</a></li>
              </ul>
              <p><a href="http://www.va.gov/ogc/apps/accreditation/index.asp" target="_blank">An accredited representative</a> with a Veterans Service Organization (VSO) can help you fill out the claim.</p>
              <h6>Learn about Veterans Pension rates</h6>
              <a href="/pension/rates" target="_blank">Find out more about how pension rates are decided.</a>
            </li>
            <li className="process-step list-two">
              <div><h5>Apply</h5></div>
              <p>Complete this pension benefits form.</p>
              <p>After submitting the form, you’ll get a confirmation message that you can print.</p>
            </li>
            <li className="process-step list-three">
              <div><h5>VA Review</h5></div>
              <p>We process claims in the order we receive them.</p>
              <p>We’ll let you know by mail if we need more information.</p>
            </li>
            <li className="process-step list-four">
              <div><h5>Decision</h5></div>
              <p>After we process your claim, you’ll get a notice in the mail about the decision.</p>
            </li>
          </ol>
        </div>
        <SaveInProgressIntro
            pageList={this.props.route.pageList}
            {...this.props.saveInProgressActions}
            {...this.props.saveInProgress}>
          Complete the form before submitting to apply for pension benefits with the 21-527EZ.
        </SaveInProgressIntro>
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={25} ombNumber="2900-0002" expDate="04/30/2019"/>
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
