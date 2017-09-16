import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { focusElement } from '../../../common/utils/helpers';
import OMBInfo from '../../../common/components/OMBInfo';
import FormTitle from '../../../common/schemaform/FormTitle';
import SaveInProgressIntro, { introActions, introSelector } from '../../../common/schemaform/SaveInProgressIntro';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }
  render() {
    return (
      <div className="schemaform-intro" itemScope itemType="http://schema.org/HowTo">
        <FormTitle title="Manage your education benefits"/>
        <p itemProp="description">This application is equivalent to Form 22-1995 (Request for Change of Program or Place of Training).</p>
        <SaveInProgressIntro
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          resumeOnly
          {...this.props.saveInProgressActions}
          {...this.props.saveInProgress}/>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one" itemProp="steps" itemScope itemType="http://schema.org/HowToSection">
              <div itemProp="name"><h5>Prepare</h5></div>
              <div itemProp="itemListElement">
                <div><h6>What you need to fill out this application</h6></div>
                <ul>
                  <li>Social Security number (required)</li>
                  <li>Basic information about the school or training facility where you want to attend (required)</li>
                  <li>Military history</li>
                  <li>Bank account direct deposit information</li>
                  <li>Education history</li>
                </ul>
                <p><a href="http://www.va.gov/ogc/apps/accreditation/index.asp">An accredited representative</a> with a Veterans Service Organization (VSO) can help you pick the right program.</p>
                <h6>Learn about educational programs</h6>
                <ul>
                  <li>See what benefits you’ll get at the school you want to attend. <a href="/gi-bill-comparison-tool/">Use the GI Bill Comparison Tool</a>.</li>
                </ul>
              </div>
            </li>
            <li className="process-step list-two" itemProp="steps" itemScope itemType="http://schema.org/HowToSection">
              <div itemProp="name"><h5>Apply for Benefits</h5></div>
              <div itemProp="itemListElement">
                <p>Complete this form.</p>
              </div>
            </li>
            <li className="process-step list-three" itemProp="steps" itemScope itemType="http://schema.org/HowToSection">
              <div  itemProp="name"><h5>VA Review</h5></div>
              <div itemProp="itemListElement">
                <div><h6>How long does it take VA to make a decision?</h6></div>
                <ul><li>We usually process claims within 30 days.</li></ul>
                <div><h6>What should I do while I wait?</h6></div>
                <ul><li>The transition from military to civilian life can be challenging. VA offers <a href="/education/tools-programs/education-career-counseling/">tools and counseling programs</a> to help you make the most of your educational options.</li></ul>
                <div><h6>What if VA needs more information?</h6></div>
                <ul><li>We will contact you if we need more information.</li></ul>
              </div>
            </li>
            <li className="process-step list-four" itemProp="steps" itemScope itemType="http://schema.org/HowToSection">
              <div itemProp="name"><h5>Decision</h5></div>
              <div itemProp="itemListElement">
                <ul><li>We usually process claims within 30 days.</li></ul>
                <ul><li>You’ll get a Certificate of Eligibility (COE) or Award Letter in the mail if your application was approved. Bring this to the VA certifying official at your school.</li></ul>
                <ul><li>If your application was not approved, you’ll get a denial letter in the mail.</li></ul>
              </div>
            </li>
          </ol>
        </div>
        <SaveInProgressIntro
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          {...this.props.saveInProgressActions}
          {...this.props.saveInProgress}>
          Please complete the 22-1995 form to apply to manage your education benefits.
        </SaveInProgressIntro>
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={20} ombNumber="2900-0074" expDate="05/31/2018"/>
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
