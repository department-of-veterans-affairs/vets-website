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
        <p>This application is equivalent to Form 21-527EZ (Application for Pension).</p>
        {__BUILDTYPE__ !== 'production' && <SaveInProgressIntro
            pageList={this.props.route.pageList}
            resumeOnly
            {...this.props.saveInProgressActions}
            {...this.props.saveInProgress}/>}
        <div className="process schemaform-process schemaform-process-sip">
          <ol>
            <li className="process-step list-one">
              <div><h5>Prepare</h5></div>
              <div><h6>What you need to fill out this application</h6></div>
              <ul>
                <li>Social Security number or VA file number (required)</li>
                <li>Military history (required)</li>
                <li>Your financial information and the financial information of your dependents (required)</li>
                <li>Work history</li>
                <li>Bank account direct deposit information</li>
                <li>Medical information</li>
              </ul>
              <p><a href="http://www.va.gov/ogc/apps/accreditation/index.asp">An accredited representative</a> with a Veterans Service Organization (VSO) can help you fill out the claim.</p>
              <h6>Learn about Veterans Pension rates</h6>
              <ul>
                <li>Find out more about how <a href="/pension/rates">pension rates</a> are decided.</li>
              </ul>
            </li>
            <li className="process-step list-two">
              <div><h5>Apply for Benefits</h5></div>
              <p>Complete this form.</p>
            </li>
            <li className="process-step list-three">
              <div><h5>VA Review</h5></div>
              <div><h6>What if VA needs more information?</h6></div>
              <ul><li>We will contact you if we need more information.</li></ul>
              <div><h6>How long does it take VA to make a decision?</h6></div>
              <ul><li>We process claims in the order we receive them, unless a claim requires priority processing.</li></ul>
            </li>
            <li className="process-step list-four">
              <div><h5>Decision</h5></div>
              <ul><li>We'll notify you by mail if we need more information from you about your claim.</li></ul>
              <ul><li>After we process your claim, you’ll get a notice in the mail about the decision.</li></ul>
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
