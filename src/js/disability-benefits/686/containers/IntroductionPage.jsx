import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { focusElement } from '../../../common/utils/helpers';
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
        <FormTitle title="Declaration of status of dependents"/>
        <p>Equal to VA Form 686 (686 Dependent-status form).</p>
        <SaveInProgressIntro
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the Application"
          {...this.props.saveInProgressActions}
          {...this.props.saveInProgress}>
          Please complete the 686 form to apply for declaration of status of dependents.
        </SaveInProgressIntro>
        <h4>Follow the steps below to apply for declaration of status of dependents.</h4>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <div><h5>Prepare</h5></div>
              <div><h6>To fill out this application, you’ll need your:</h6></div>
              <ul>
                <li>Social Security number (required)</li>
              </ul>
              <p><strong>What if I need help filling out my application?</strong> An accredited representative, like a Veterans Service Officer (VSO), can help you fill out your claim. <a href="/disability-benefits/apply/help/index.html">Get help filing your claim</a>.</p>
            </li>
            <li className="process-step list-two">
              <div><h5>Apply</h5></div>
              <p>Complete this declaration of status of dependents form.</p>
              <p>After submitting the form, you’ll get a confirmation message. You can print this for your records.</p>
            </li>
            <li className="process-step list-three">
              <div><h5>VA Review</h5></div>
              <p>We process claims within a week. If more than a week has passed since you submitted your application and you haven’t heard back, please don’t apply again. Call us at.</p>
            </li>
            <li className="process-step list-four">
              <div><h5>Decision</h5></div>
              <p>Once we’ve processed your claim, you’ll get a notice in the mail with our decision.</p>
            </li>
          </ol>
        </div>
        <SaveInProgressIntro
          buttonOnly
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the Application"
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
