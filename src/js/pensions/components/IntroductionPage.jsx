import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { focusElement } from '../../common/utils/helpers';
import OMBInfo from '../../common/components/OMBInfo';
import FormTitle from '../../common/schemaform/FormTitle';
import ProgressButton from '../../common/components/form-elements/ProgressButton';
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
        <FormTitle title="Apply for pension benefits"/>
        <p>Equal to Form 21-527EZ</p>
        {__BUILDTYPE__ !== 'production' && <SaveInProgressIntro
            pageList={this.props.route.pageList}
            resumeOnly
            {...this.props.saveInProgressActions}
            {...this.props.saveInProgress}/>}
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
                  <h6 className="usa-alert-heading">Fully Developed Claim program</h6><br/>
                  <p>The Fully Developed Claim program is the fastest way to get your claim processed, and there’s no risk to your taking part in it. If you want to use the FDC program for an expedited (faster than usual) application review process, you’ll need to fill out and hand in any additional forms before you give us your pension application. You’ll also need to include all the supporting documents you have access to. We won’t need to ask you for more information.</p>
                  {/* <p><a href="/">Learn more about the FDC program</a></p> */}
                  {/* <p>If you’re making a claim for Veterans non-service-connected pension benefits, submit your claim according to FDC Criteria.<br/><a href="/">Find out about FDC Criteria</a></p> */}
                </div>
              </div>
              <br/>
              <h6>Aid and Attendance and Housebound benefits</h6>
              If you’re housebound, you may qualify for Aid and Attendance and Housebound benefits in addition to your pension benefits.
              <ul>
                <li>Aid and Attendance benefits. If you live in a nursing home, the nursing home will need to fill out Request for Nursing Home Information in Connection with Claim for Aid and Attendance (VA Form 21-0779).<br/><a href="http://www.vba.va.gov/pubs/forms/VBA-21-0779-ARE.pdf">Download VA Form 21-0779</a></li>
                <li>Housebound benefits. If you live at home and have visiting medical care, you and your doctor will need to fill out Examination for Housebound Status or Permanent Need for Regular Aid and Attendance (VA Form 21-2680).<br/><a href="http://www.vba.va.gov/pubs/forms/VBA-21-2680-ARE.pdf">Download VA Form 21-2680</a></li>
              </ul>
              <p><a href="http://www.va.gov/ogc/apps/accreditation/index.asp">An accredited representative</a> with a Veterans Service Organization (VSO) can help you fill out the claim.</p>
              <h6>Learn about Veterans Pension rates</h6>
              <a href="/pension/rates">Find out more about how pension rates are decided.</a>
            </li>
            <li className="process-step list-two">
              <div><h5>Apply</h5></div>
              <p>Complete this pension benefits form.</p>
              <p>After submitting the form, you'll get a confirmation message that you can print.</p>
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
        {__BUILDTYPE__ !== 'production' && <SaveInProgressIntro
            pageList={this.props.route.pageList}
            {...this.props.saveInProgressActions}
            {...this.props.saveInProgress}>
          Complete the form before submitting to apply for pension benefits with the 21-527EZ.
        </SaveInProgressIntro>}
        {__BUILDTYPE__ === 'production' && <div className="row form-progress-buttons schemaform-buttons">
          <div className="small-6 usa-width-five-twelfths medium-5 end columns">
            <ProgressButton
                onButtonClick={this.goForward}
                buttonText="Get Started"
                buttonClass="usa-button-primary"
                afterText="»"/>
          </div>
        </div>}
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
