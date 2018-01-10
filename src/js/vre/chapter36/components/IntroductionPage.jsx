import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { focusElement } from '../../../common/utils/helpers';
import OMBInfo from '../../../common/components/OMBInfo';
import FormTitle from '../../../common/schemaform/components/FormTitle';
import SaveInProgressIntro, { introActions, introSelector } from '../../../common/schemaform/save-in-progress/SaveInProgressIntro';

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
        <FormTitle title="Apply for VR&E"/>
        <p>Equal to form chapter 36</p>
        <SaveInProgressIntro
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          pageList={this.props.route.pageList}
          startText="Start the Chapter 36 application"
          {...this.props.saveInProgressActions}
          {...this.props.saveInProgress}>
          Please complete the Chapter 36 form to apply for benefits
        </SaveInProgressIntro>
        <div className="process schemaform-process schemaform-process-sip">
          <h4>Follow the steps below to apply for VR&E benefits.</h4>
          <ol>
            <li className="process-step list-one">
              <div><h5>Prepare</h5></div>
              <div><h6>To fill out this application, you’ll need information about the deceased Veteran, including their:</h6></div>
              <ul>
                <li>Social Security number or VA file number (required)</li>
                <li>Date and place of birth (required)</li>
                <li>Date and place of death (required)</li>
                <li>Military status and history</li>
              </ul>
              <div><h6>You may need to upload:</h6></div>
              <ul>
                <li>A copy of the deceased Veteran’s DD214 or other separation documents</li>
                <li>A copy of the Veteran’s death certificate</li>
                <li>Documentation for transportation costs (if you’re claiming costs for the transportation of the Veteran’s remains)</li>
              </ul>
              <p><strong>What if I need help filling out my application?</strong> An accredited representative with a Veterans Service Organization (VSO) can help you fill out your claim. <a href="/disability-benefits/apply/help/index.html">Find an accredited representative</a>.</p>
            </li>
            <li className="process-step list-two">
              <div><h5>Apply</h5></div>
              <p>Complete this form.</p>
              <p>After submitting the form, you’ll get a confirmation message. You can print this for your records.</p>
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
          buttonOnly
          pageList={this.props.route.pageList}
          startText="Start the Chapter 36 application"
          {...this.props.saveInProgressActions}
          {...this.props.saveInProgress}/>
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={15} ombNumber="2900-0003" expDate="04/30/2020"/>
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
