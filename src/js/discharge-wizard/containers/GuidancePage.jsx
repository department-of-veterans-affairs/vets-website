import { connect } from 'react-redux';
import React from 'react';
import moment from 'moment';

import AlertBox from '../../common/components/AlertBox';
import CarefulConsiderationStatement from '../components/CarefulConsiderationStatement';
import { branchOfService, board, formData, venueAddress } from '../utils';
import { venueWarning } from '../config';

class GuidancePage extends React.Component {
  componentDidMount() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://standards.usa.gov/assets/js/vendor/uswds.min.js';
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  renderResultSummary() {
    const forReconsideration = this.props.formValues['10_prevApplicationType'] === '3';
    return `You need to complete Department of Defense (DoD) Form ${formData(this.props.formValues).num} and send it to the ${board(this.props.formValues).name} for the ${branchOfService(this.props.formValues['7_branchOfService'])}${forReconsideration ? ' for reconsideration' : ''}`;
  }

  renderOptionalStep() {
    const validReason = ['1', '2'].indexOf(this.props.formValues['1_reason']) > -1;
    const dischargeYear = parseInt(this.props.formValues['4_dischargeYear'], 10);
    const validYear = dischargeYear >= 2001 && dischargeYear <= 2009;

    if (validReason && validYear) {
      return (
        <div className="feature">
          <h4>(Optional): Apply to the Physical Disability Board of Review (PDBR)</h4>
          <p>
            The Department of Defense (DoD) created the Physical Disability Board of Review (PDBR) specifically to review appeals about low disability ratings for Veterans discharged between 2001 and 2009.  Many Veterans discharged during this time period were inaccurately given lower disability ratings than they deserved, especially if they suffered from TBI, PTSD, or mental health conditions. If you were discharged in this period and previously received a disability rating for PTSD which you feel is too low, you are eligible to apply to the PDBR for review. The PDBR does not issue discharge status upgrades—but if the PDBR finds that your disability rating was unjustly low, this may help you make your case to upgrade your discharge status. Many Veterans in this situation choose to <a href="http://www.health.mil/PDBR">make a PDBR application</a> before applying for a discharge upgrade. <a href="https://health.mil/Military-Health-Topics/Conditions-and-Treatments/Physical-Disability/Disability-Evaluation/Physical-Disability-Board-of-Review/PDBR-Application-Process">Apply for a PBDR review</a>.
          </p>
        </div>
      );
    }
    return null;
  }

  renderStepOne() {
    const questionOneResponse = this.props.formValues['1_reason'];
    const specReason = ['1', '2', '4'].indexOf(questionOneResponse) > -1;
    const boardToSubmit = board(this.props.formValues);
    /* eslint-disable quote-props */
    const reasons = {
      '1': {
        name: 'PTSD or other mental health conditions',
        type: 'condition',
      },
      '2': {
        name: 'TBI',
        type: 'condition',
      },
      '4': {
        name: 'sexual assault',
        type: 'experience',
      },
    };
    /* eslint-enable quote-props */

    const strongCaseTips = () => {
      if (specReason) {
        return (
          <div>
            <span>For discharges related to {reasons[questionOneResponse].name}, be sure to answer the following questions to make the strongest case:</span>
            <ul>
              <li>
                Did you have a {reasons[questionOneResponse].type} that may explain or contribute to the discharge?
              </li>
              <li>
                Did that {reasons[questionOneResponse].type} {questionOneResponse === '4' ? 'happen' : 'exist'} during your military service?
              </li>
              <li>
                Does the {reasons[questionOneResponse].type} directly explain ot contribute to the discharge?
              </li>
              <li>
                Why does the {reasons[questionOneResponse].type} outweigh any other evidence that supports the discharge?
              </li>
            </ul>
          </div>
        );
      }
      return null;
    };

    const form = formData(this.props.formValues);
    return (
      <li className="list-group-item">
        <div>
          <h4>Download and fill out DoD Form {form.num}</h4>
          <p>
            Important tips for completing Form {form.num}:
          </p>
          <ul>
            <li>Pay special attention to item 6, which asks for the reason for your change. Most Veterans attach additional pages to answer this question. {strongCaseTips()}</li>
            {this.props.formValues['10_prevApplicationType'] === '3' && <li>Because you are applying for reconsideration of a previous application, you will need to enter the previous application number in Item 6b. Note that you are generally only eligible for reconsideration if you have new evidence to present, which was not available at the time of your last application. Make sure you clarify exactly what that new evidence entails.</li>}
            {boardToSubmit.abbr !== 'DRB' && <li>Item 8 asks for your date of “discovery” of the injustice. If this date isn’t in the last 3 years, you’ll need to argue that the Board should hear your case anyway. This is not a strict date, so don’t let the 3-year rule keep you from applying if you have a strong case. You may note your recent discovery of new evidence about your claim or recent policy changes (like careful consideration for PTSD, TBI, or military sexual assault or harassment.</li>}
            {boardToSubmit.abbr !== 'DRB' && <li>Item 10 asks if you are willing to appear in-person before the Board. The Board rarely asks Veterans to appear in person, but indicating that you’re willing to do so may help show how serious you are about your case.</li>}
            {boardToSubmit.abbr === 'DRB' && this.props.formValues['10_prevApplicationType'] !== '1' && <li>You can request either a Documentary Review or Personal Appearance Review from the Discharge Review Board (DRB). If your case is especially complicated and requires detailed explanation, you MAY have more success with a Personal Appearance Review, but know that you will not be reimbursed for your travel costs. Documentary Reviews are generally faster and so it is usually recommended to begin with one. Also, if you are denied in a Documentary Review, you can then appeal via Personal Appearance, but you can’t request Documentary Review after a Personal Appearance.</li>}
            {boardToSubmit.abbr === 'DRB' && this.props.formValues['10_prevApplicationType'] === '1' && <li>The DRB allows you to request either a Documentary Review or a Personal Appearance Review. Because your application was already denied during a Documentary Review, you must apply for a Personal Appearance Review.</li>}
          </ul>
          <a href={form.link} className="usa-button-primary va-button">Download Form {form.num}</a>
          <AlertBox
            content={<div>
              <h4>Need Help?</h4>
              <p>The process of preparing a discharge upgrade or correction application can sometimes be a lot of work and take a long time. Although many Veterans are successful by themselves, it may be helpful to find someone to advocate for you in this process. Try a VSO, search online for a lawyer who may provide services for low or no cost, or ask other Veterans for recommendations.</p>
            </div>}
            isVisible
            status="warning"/>
        </div>
      </li>
    );
  }

  renderStepTwo() {
    const boardToSubmit = board(this.props.formValues);
    let militaryRecordInfo;
    if (parseInt(this.props.formValues['4_dischargeYear'], 10) >= 1997) {
      militaryRecordInfo = <p>You can <a href="https://www.dpris.dod.mil/veteranaccess.html">retrieve your complete military personnel record</a> (your Official Military Personnel File, or OMPF) online</p>;
    } else {
      militaryRecordInfo = <p>You can make a <a href="https://www.archives.gov/veterans/military-service-records">request online or by mail to receive your complete military personnel record</a> (your Official Military Personnel File, or OMPF) in the mail. You may at first only receive a portion of the available records; you will want to request the full set of records.</p>;
    }

    let specificTypeInstruction;
    switch (this.props.formValues['1_reason']) {
      case '1':
        specificTypeInstruction = 'you suffered from symptoms of PTSD or mental health conditions while in the service.';
        break;
      case '2':
        specificTypeInstruction = 'you suffered from symptoms of TBI while in the service.';
        break;
      case '3':
        if (this.props.formValues['2_dischargeType'] === '2') {
          specificTypeInstruction = 'your discharge status was due only to your sexual orientation and not other bad conduct.';
        }
        break;
      case '4':
        specificTypeInstruction = 'the conduct that led to your discharge stemmed from military sexual assault and not other factors.';
        break;
      default:
    }

    return (
      <li className="list-group-item">
        <div>
          <h4>Add supporting information</h4>
          <p>
            To improve your chances of success, also include as many of the following documents as you can. {boardToSubmit.abbr !== 'DRB' ? <span>Note that the {boardToSubmit.abbr} is required to assist in helping you collect evidence <strong>IF</strong> you can demonstrate you reasonably attempted to obtain your records but could not.</span> : null}
          </p>
          <ul>
            <li><strong>Military Record</strong>: The Board won’t have access to your military records, so you will need to submit any relevant documentation yourself. {militaryRecordInfo} {specificTypeInstruction && <p>Remember, you must prove that {specificTypeInstruction}. Submit any documents from this record which help support your case for a discharge upgrade.</p>}</li>
            {this.renderMedicalRecordInfo()}
            <li><strong>"Buddy Statements" or Other References From Service</strong>: On top of military and medical records, some Veterans submit statements from friends they knew while in the service, or other individuals with direct knowledge of your time in the military. The content of the letter is more important than who it comes from, as long as their opinion is credible and they know you well. Ask friends or others to write statements in support of your appeal and send them to you to include with your application.</li>
            <li><strong>Testaments of Achievements Since Service</strong>: The Boards may be able to take into account positive steps you have taken in your life since your discharge. Specific guidance on this issue will be released soon, but, in the meantime, you may still want to include evidence of progress you’ve made. For example, if you were discharged for reasons related to alcohol or drugs, submit a certificates from a treatment program showing you’ve been drug free for an extended period of time. You can also submit letters from employers or leaders in your community attesting to your positive contributions to your community.</li>
          </ul>
        </div>
      </li>
    );
  }

  renderMedicalRecordInfo() {
    if (['1', '2', '4'].indexOf(this.props.formValues['1_reason']) > -1) {
      let requestQuestion;
      if (parseInt(this.props.formValues['4_dischargeYear'], 10) >= 1992) {
        requestQuestion = <a href="https://www.archives.gov/st-louis/military-personnel/ompf-background.html">Find out how to request your military medical records.</a>;
      } else {
        requestQuestion = <span>Your <strong>military health records</strong> will be included with your VA medical records you request.</span>;
      }

      return (
        <li>
          <strong>Medical Records</strong>: In most cases, the Board won’t have easy access to your medical records, so you should submit any relevant documentation yourself as much as possible.
          <ul>
            <li>You can request your VA medical records by submitting <a href="https://www.va.gov/vaforms/medical/pdf/vha-10-5345-fill.pdf">VA Form 10-5345</a> to your local VA Medical Center.</li>
            <li>{requestQuestion}</li>
            <li>You can also submit <strong>medical records from a private practice doctor</strong>—contact your doctor’s office to get the records you need.</li>
          </ul>
        </li>
      );
    }
    return null;
  }

  renderStepThree() {
    const noPrevApp = this.props.formValues['8_prevApplication'] === '2';
    const prevAppType = this.props.formValues['10_prevApplicationType'];
    const prevAppYear = this.props.formValues['9_prevApplicationYear'];
    const dischargeYear = this.props.formValues['4_dischargeYear'];
    const dischargeMonth = this.props.formValues['5_dischargeMonth'] || 1;
    const oldDischarge = moment().diff(moment([dischargeYear, dischargeMonth]), 'years', true) > 15;

    const boardToSubmit = board(this.props.formValues);

    let boardExplanation;
    let onlineSubmissionMsg;

    if (prevAppType === '2') {
      boardExplanation = <p>Because your application was denied by the DRB on a Personal Appearance review, you must apply to the {boardToSubmit.abbr} for the {branchOfService(this.props.formValues['7_branchOfService'])} to appeal that decision.</p>;
    } else if (prevAppType === '3') {
      boardExplanation = <p>Because you previously applied to the {boardToSubmit.abbr}, you must re-apply to the {boardToSubmit.abbr} for reconsideration.</p>;
    } else if ((noPrevApp || (['1', '4'].indexOf(prevAppType) > -1) || prevAppYear === '1') && oldDischarge) {
      boardExplanation = <p>Because your discharge was over 15 years ago, you must apply to the {boardToSubmit.abbr} for the {branchOfService(this.props.formValues['7_branchOfService'])}.</p>;
    } else if (this.props.formValues['6_courtMartial'] === '1') {
      boardExplanation = <p>Because your discharge was the result of a General Court-Martial, you must apply to the  {boardToSubmit.abbr} for the {branchOfService(this.props.formValues['7_branchOfService'])}.</p>;
    } else if (this.props.formValues['1_reason'] === '5' || this.props.formValues['3_intention'] === '1') {
      boardExplanation = <p>Because you are seeking to change information other than your discharge status, re-enlistment code, and narrative reason for discharge, you must apply to the {boardToSubmit.abbr} for the {branchOfService(this.props.formValues['7_branchOfService'])}.</p>;
    } else if (boardToSubmit.abbr === 'DRB') {
      boardExplanation = <p>Given the details of your request, you must apply to the DRB for the {branchOfService(this.props.formValues['7_branchOfService'])}. {prevAppType === '1' ? 'Because your application was rejected by the DRB on Documentary Review, you must apply for a Personal Appearance Review.' : ''} The DRB is a panel of commissioned officers, or a combination of senior NCOs and officers. The deadline to apply to the DRB is 15 years after your date of discharge; after this time, you must apply to a different board.</p>;
    }

    if (boardToSubmit.abbr === 'DRB' && this.props.formValues['7_branchOfService'] === 'army') {
      onlineSubmissionMsg = <p>You can also submit this information online at <a href="http://actsonline.army.mil/">ACTSOnline</a>. </p>;
    } else {
      onlineSubmissionMsg = <p>Unfortunately, there isn’t a way to submit this form online.</p>;
    }

    return (
      <li className="list-group-item">
        <div>
          <h4>Mail your completed form and all supporting materials</h4>
          {boardExplanation}
          {prevAppYear === '1' ? <p>Because your last application was made prior to the release of DoD guidance related to discharges like yours, DoD will effectively consider your application as a new application. Your previous application may be consulted for evidence, but usual rules about how to appeal previous decisions do not apply.</p> : null}
          <p>
            Mail your completed form and all supporting materials to the {boardToSubmit.abbr} at:
          </p>
          {venueAddress(this.props.formValues)}
          {onlineSubmissionMsg}
        </div>
      </li>
    );
  }

  renderAddlInstructions() {
    return (
      <div>
        <div className="usa-accordion accordion-container">
          <ul className="usa-unstyled-list">
            <li itemScope itemType="http://schema.org/Question">
              <button className="usa-button-unstyled usa-accordion-button" aria-controls="dbq1" itemProp="name">What happens after I send in my completed form and supporting materials?</button>
              <div id="dbq1" className="usa-accordion-content" itemProp="acceptedAnswer" itemScope itemType="http://schema.org/Answer">
                <div itemProp="text">
                  <p>Usually, it takes several months for the Board to review your application. You can continue to submit supporting documentation until the Board has reviewed your application.</p>
                  <p>If your application is successful, the Board will either issue you a DD-215, which contains updates to the DD-214, or an entirely new DD-214. If you get a new DD-214, <a href="https://www.dpris.dod.mil/veteranaccess.html">request a copy</a>.</p>
                  <p>If your appeal results in raising your discharge status to honorable, you will be immediately eligible for all VA benefits and services. In the meantime, you may still apply for VA eligibility by <a href="#">requesting a Character of Discharge review</a>.</p>
                </div>
              </div>
            </li>
            <li itemScope itemType="http://schema.org/Question">
              <button className="usa-button-unstyled usa-accordion-button" aria-controls="dbq2" itemProp="name">Can I apply for VA benefits in the meantime?</button>
              <div id="dbq2" className="usa-accordion-content" itemProp="acceptedAnswer" itemScope itemType="http://schema.org/Answer">
                <div itemProp="text">
                  <AlertBox
                    isVisible
                    status="warning"
                    content={<p>Even with a less than honorable discharge, you may be able to still access some VA benefits through the <a href="https://www.benefits.va.gov/BENEFITS/docs/COD_Factsheet.pdf">Character of Discharge or Character of Service Determination process.</a></p>}/>
                  <p>If you have a discharge that is less than honorable or general, when you apply for VA benefits, it will trigger a review at VA. VA will review your record to determine if your service was "honorable for VA purposes."</p>
                  <p>You should receive a letter from VA letting you that they have begun to review your case. The VA handles these reviews on a case-by-case basis, and so they can take a long time — sometimes over a year. To access VA benefits, it helps to respond to this letter with information supporting your case. For example, if you’re asking VA to forgive your past behavior, provide evidence of positive steps you have taken in your life since your time in the service such as "buddy statements" or a certificate showing you’ve completed an drug rehabilitation program.</p>
                  <p>As with applying for a discharge upgrade, you may consider finding someone to advocate on your behalf (such as a lawyer or VSO) in collecting and submitting this evidence, depending on the complexity of your case.</p>
                  <p>Many veterans with less than honorable discharges pursue both methods: a VA characterization of discharge review, and a DoD discharge upgrade. There is no reason not to pursue both at the same time</p>
                  <p>If you experienced sexual assault or harassment while in the military or need mental health services related to PTSD or other mental health conditions linked to your service, you may qualify for VA health benefits without a VA characterization of discharge review or a discharge upgrade.</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <h4>Additional Resources</h4><hr/>
        <ul>
          <li><a href="https://www.vets.gov/health-care/health-conditions/military-sexual-trauma/">VA health benefits for Veterans who experience military sexual trauma</a></li>
          <li><a href="https://www.vets.gov/health-care/health-conditions/mental-health/">VA health benefits for Veterans with mental health conditions</a></li>
          <li><a href="https://www.vets.gov/health-care/health-conditions/mental-health/ptsd/">VA health benefits for Veterans with PTSD</a></li>
          <li><a href="http://arba.army.pentagon.mil/adrb-overview.html">Army Discharge Review Board</a></li>
          <li><a href="http://www.secnav.navy.mil/mra/CORB/pages/ndrb/default.aspx">Navy Discharge Review Board</a></li>
          <li><a href="https://www.benefits.va.gov/BENEFITS/docs/COD_Factsheet.pdf">VA Guidance on COD Review</a></li>
        </ul>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h1>Guidance on Upgrading Your Discharge</h1>
        <div className="medium-8">
          <div className="va-introtext">
            <p>
              <strong>Result</strong>: {this.renderResultSummary()}.
            </p>
          </div>
          <CarefulConsiderationStatement reason={this.props.formValues['1_reason']} dischargeType={this.props.formValues['2_dischargeType']}/>
          <AlertBox
            content={venueWarning}
            isVisible={this.props.formValues['10_prevApplicationType'] === '4'}
            status="warning"/>
          {this.renderOptionalStep()}
          <ul className="vertical-list-group more-bottom-cushion numbered">
            {this.renderStepOne()}
            {this.renderStepTwo()}
            {this.renderStepThree()}
          </ul>
          {this.renderAddlInstructions()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    formValues: state.dischargeWizard.form,
  };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GuidancePage);
