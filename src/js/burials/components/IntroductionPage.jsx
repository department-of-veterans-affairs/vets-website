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
        <FormTitle title="Apply for burial benefits"/>
        <p>Equal to Form 21P-530</p>
        <SaveInProgressIntro
            pageList={this.props.route.pageList}
            resumeOnly
            {...this.props.saveInProgressActions}
            {...this.props.saveInProgress}/>
        <div className="process schemaform-process schemaform-process-sip">
          <ol>
            <li className="process-step list-one">
              <div><h5>Prepare</h5></div>
              <div><h6>Review <a href="/burials-and-memorials/survivor-and-dependent-benefits/burial-costs/">eligibility information</a>.</h6></div>
              <br/>
              <div><h6>You’ll need information about the deceased Veteran, including their:</h6></div>
              <ul>
                <li>Social Security number or VA file number (required)</li>
                <li>Date and place of birth (required)</li>
                <li>Date and place of death (required)</li>
                <li>Military status and history—information like service dates, branch, and rank that’s commonly found on the DD214 or other separation documents</li>
              </ul>
              <div><h6>You may need to upload:</h6></div>
              <ul>
                <li>A copy of the deceased Veteran’s DD214 or other separation documents</li>
                <li>A copy of the Veteran’s death certificate</li>
                <li>Documentation for transportation costs (if you’re claiming costs for the transportation of the Veteran’s remains)</li>
              </ul>
              <p><a href="http://www.va.gov/ogc/apps/accreditation/index.asp">An accredited representative</a> with a Veterans Service Organization (VSO) can help you fill out the claim.</p>
              <h6>Learn about other survivor and dependent benefits</h6>
              <ul>
                <li>If you’re the survivor or dependent of a Veteran who died in the line of duty or from a service-related illness, you may be able to get a benefit called <a href="/burials-and-memorials/survivor-and-dependent-benefits/compensation/">Dependency and Indemnity Compensation</a>.</li>
              </ul>
            </li>
            <li className="process-step list-two">
              <div><h5>Apply</h5></div>
              <p>Complete this burial benefits form.</p>
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
          Complete the form before submitting to apply for burial benefits with the 21P-530.
        </SaveInProgressIntro>
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
