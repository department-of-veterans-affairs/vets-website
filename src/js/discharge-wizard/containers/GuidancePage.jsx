import { connect } from 'react-redux';
import React from 'react';
import moment from 'moment';

import AlertBox from '../../common/components/AlertBox';
import CarefulConsiderationStatement from '../components/CarefulConsiderationStatement';
import { branchOfService, board, formData, venueAddress } from '../utils';
import { venueWarning } from '../config';

class GuidancePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handleFAQToggle = (e) => {
    e.preventDefault();
    window.dataLayer.push({ event: 'discharge-upgrade-faq-toggle' });
    this.setState({
      [e.target.name]: !this.state[e.target.name],
    });
  }

  handlePrint(e) {
    e.preventDefault();
    window.dataLayer.push({ event: 'discharge-upgrade-print' });
    if (window.print) {
      window.print();
    }
  }

  renderResultSummary() {
    const forReconsideration = this.props.formValues['10_prevApplicationType'] === '3';
    return `Based on your answers, you need to complete Department of Defense (DoD) Form ${formData(this.props.formValues).num} and send it to the ${board(this.props.formValues).name} for the ${branchOfService(this.props.formValues['1_branchOfService'])}${forReconsideration ? ' for reconsideration' : ''}`;
  }

  renderOptionalStep() {
    const validReason = ['1', '2'].indexOf(this.props.formValues['4_reason']) > -1;
    const dischargeYear = parseInt(this.props.formValues['2_dischargeYear'], 10);
    const validYear = dischargeYear >= 2001 && dischargeYear <= 2009;

    if (validReason && validYear) {
      return (
        <div className="feature">
          <h4>(Optional): Apply to the Physical Disability Board of Review (PDBR)</h4>
          <p>
            If you believe your disability rating for TBI, PTSD, or mental health conditions is too low, consider applying to the Physical Disability Board of Review (PDBR). The Department of Defense (DoD) created the PDBR specifically to review appeals about low disability ratings for Veterans discharged between 2001 and 2009. Many Veterans discharged during this time period were inaccurately given lower disability ratings than they deserved, especially if they suffered from TBI, PTSD, or mental health conditions. If you were discharged in this period and previously received a disability rating which you feel is too low, you are eligible to apply to the PDBR for review. The PDBR does not issue discharge upgrades—but if the PDBR finds that your disability rating was unjustly low, this may help you make your case to upgrade your discharge. Many Veterans in this situation choose to make a PDBR application before applying for a discharge upgrade. <a target="_blank" href="https://health.mil/PDBR">Learn more about PBDR reviews</a> <a target="_blank" href="https://health.mil/Military-Health-Topics/Conditions-and-Treatments/Physical-Disability/Disability-Evaluation/Physical-Disability-Board-of-Review/PDBR-Application-Process">Apply for a PBDR review</a>.
          </p>
        </div>
      );
    }
    return null;
  }

  renderStepOne() {
    const questionOneResponse = this.props.formValues['4_reason'];
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
                Did you have {reasons[questionOneResponse].type === 'experience' ? 'an' : 'a'} {reasons[questionOneResponse].type} that may explain or contribute to the discharge?
              </li>
              <li>
                Did that {reasons[questionOneResponse].type} {questionOneResponse === '4' ? 'happen' : 'exist'} during your military service?
              </li>
              <li>
                Why does the {reasons[questionOneResponse].type} directly explain or contribute to the discharge?
              </li>
              <li>
                Why does the {reasons[questionOneResponse].type} outweigh any other reasons you may have been discharged for?
              </li>
            </ul>
          </div>
        );
      }
      return null;
    };

    const dd214Tips = (
      <ul>
        <li>Pay special attention to item 6, which asks for the reason for your change. Here you should explain why you need a fresh DD-214, including any problems you are facing when having to show both the DD-214 and DD-215. You may consider attaching additional pages to fully answer this question.</li>
      </ul>
    );

    const nonDd2014Tips = (
      <ul>
        <li>Pay special attention to item 6, which asks for the reason for your change. Most Veterans attach additional pages to answer this question. {strongCaseTips()}</li>
        {this.props.formValues['10_prevApplicationType'] === '3' && <li>Because you are applying for reconsideration of a previous application, you will need to enter the previous application number in Item 6b. Note: You are generally only eligible for reconsideration if you have new evidence to present that was not available at the time of your last application. Make sure you clarify exactly what that new evidence is. Additionally, the change in DoD policy, such as new consideration guidelines for PTSD, TBI, and sexual assault or harassment can qualify you for reconsideration.</li>}
        {this.props.formValues['4_reason'] === '4' && <li>
          Note: For upgrades related to sexual assault or harassment, you do not need to prove the original assault or harassment occurred—meaning if you didn't file charges or report the incident, you can still apply for an upgrade. The important part of your application is to explain how the incident impacted your service. For example, detail how the incident caused a decrease in your productivity, or was the reason for PTSD.
        </li>}
        {boardToSubmit.abbr !== 'DRB' && <li>Item 8 asks for your date of "discovery" of the injustice. If this date isn’t in the last 3 years, you’ll need to argue that the Board should hear your case anyway. This is not a strict date, so don’t let the 3-year rule keep you from applying if you have a strong case. You may note your recent discovery of new evidence about your claim or recent policy changes (like careful consideration for PTSD, TBI, or military sexual assault or harassment).</li>}
        {boardToSubmit.abbr !== 'DRB' && <li>Item 10 asks if you are willing to appear in-person before the Board in Washington, DC. The Board rarely asks Veterans to appear in person, but indicating that you’re willing to do so may help show how serious you are about your case.</li>}
        {boardToSubmit.abbr === 'DRB' && this.props.formValues['10_prevApplicationType'] !== '1' && <li>You can request either a Documentary Review or Personal Appearance Review from the Discharge Review Board (DRB). If your case is especially complicated and requires detailed explanation, you <strong>may</strong> have more success with a Personal Appearance Review. Note that you will have to pay your travel costs if you make a personal appearance. Documentary Reviews are generally faster and so it is usually recommended to begin with one. Also, if you are denied in a Documentary Review, you can then appeal via Personal Appearance, but you can’t request Documentary Review after a Personal Appearance.</li>}
        {boardToSubmit.abbr === 'DRB' && this.props.formValues['10_prevApplicationType'] === '1' && <li>The DRB allows you to request either a Documentary Review or a Personal Appearance Review. Because your application was already denied during a Documentary Review, you must apply for a Personal Appearance Review in Washington, DC. Note that you will have to pay your travel costs if you make a personal appearance.</li>}
      </ul>
    );

    const form = formData(this.props.formValues);
    return (
      <li className="list-group-item">
        <div>
          <h4>Download and fill out DoD Form {form.num}</h4>
          <p>
            Important tips for completing Form {form.num}:
          </p>
          {this.props.formValues['4_reason'] === '8' ? dd214Tips : nonDd2014Tips}
          <a target="_blank" href={form.link} className="usa-button-primary va-button">Download Form {form.num}</a>
          <AlertBox
            content={<div>
              <h4 className="usa-alert-heading">Need help preparing your application?</h4>
              <p>The process of preparing a discharge upgrade or correction application can sometimes be a lot of work and take a long time. Although many Veterans are successful by themselves, it may be helpful to find someone to advocate for you in this process. Try a Veteran Service Organization (VSO), search online for a lawyer who may provide services for low or no cost, or ask other Veterans for recommendations. <a target="_blank" href="https://www.benefits.va.gov/vso/varo.asp">Find a VSO near you</a>.</p>
            </div>}
            isVisible
            status="warning"/>
        </div>
      </li>
    );
  }

  renderStepTwo() {
    if (this.props.formValues['4_reason'] === '8') {
      return null;
    }

    const boardToSubmit = board(this.props.formValues);
    let militaryRecordInfo;
    if (parseInt(this.props.formValues['2_dischargeYear'], 10) >= 1997) {
      militaryRecordInfo = <p>You can retrieve your complete military personnel record (your Official Military Personnel File, or OMPF) online. <a target="_blank" href="https://www.dpris.dod.mil/veteranaccess.html">Get your military personnel record.</a></p>;
    } else {
      militaryRecordInfo = <p>You can make a request online or by mail to receive your complete military personnel record (your Official Military Personnel File, or OMPF) in the mail. You may at first only receive a portion of the available records; you will want to request the full set of records.<a target="_blank" href="https://www.archives.gov/veterans/military-service-records">Get your military personnel record.</a></p>;
    }

    let specificTypeInstruction;
    switch (this.props.formValues['4_reason']) {
      case '1':
        specificTypeInstruction = 'you suffered from symptoms of PTSD or mental health conditions while in the service';
        break;
      case '2':
        specificTypeInstruction = 'you suffered from symptoms of TBI while in the service';
        break;
      case '3':
        if (this.props.formValues['5_dischargeType'] === '2') {
          specificTypeInstruction = 'your discharge status was due only to your sexual orientation and not other bad conduct';
        }
        break;
      case '4':
        specificTypeInstruction = 'the conduct that led to your discharge stemmed from military sexual assault and not other factors';
        break;
      default:
    }

    return (
      <li className="list-group-item">
        <div>
          <h4>Add supporting information</h4>
          <p>
            To improve your chances of success, also include as many of the following documents as you can. {boardToSubmit.abbr !== 'DRB' ? <span>Note that the {boardToSubmit.abbr} is required to help you collect evidence if you can demonstrate you reasonably attempted to obtain your records but could not.</span> : null}
          </p>
          <ul>
            <li><strong>Military Record</strong>: The Board won’t have access to your military records, so you will need to submit any relevant documentation yourself. {militaryRecordInfo} {specificTypeInstruction && <p>Remember, you must prove that {specificTypeInstruction}. Submit any documents from this record which help support your case for a discharge upgrade.</p>}</li>
            {this.renderMedicalRecordInfo()}
            <li><strong>"Buddy Statements" or Other References From Service</strong>: On top of military records, some Veterans submit statements from friends they knew while in the service, or other individuals with direct knowledge of their time in the military. The content of the letter is more important than who it comes from, as long as their opinion is credible and they know you well. Ask friends or others to write statements in support of your appeal and send them with your application. The letter may include statements about your achievements in the military, positive relationships you formed in the military, why they think your discharge was unjust or incorrect, or good deeds you did during that time.</li>
            <li><strong>Testaments of Achievements Since Service</strong>: You may decide to add information about what you have achieved in your life since your discharge, particularly if your discharge also involved any issues related to drugs, alcohol, or other bad behavior. This can be in the form of a letter from an employer or community leader, evidence of successful drug treatment, or copies of certificates and degrees. More specific guidance about acheivements since service will be released by DoD soon, but in the meantime add any acheivements you would like to highlight.</li>
          </ul>
        </div>
      </li>
    );
  }

  renderMedicalRecordInfo() {
    if (['1', '2', '4'].indexOf(this.props.formValues['4_reason']) > -1) {
      let requestQuestion;
      if (parseInt(this.props.formValues['2_dischargeYear'], 10) >= 1992) {
        requestQuestion = <a target="_blank" href="https://www.archives.gov/st-louis/military-personnel/ompf-background.html">Find out how to request your military medical records.</a>;
      } else {
        requestQuestion = <span>Your <strong>military health records</strong> will be included with your VA medical records you request.</span>;
      }

      return (
        <li>
          <strong>Medical Records</strong>: In most cases, the Board won’t have easy access to your medical records, so you should submit any relevant documentation yourself as much as possible.
          <ul>
            <li>You can request your <strong>VA medical records</strong> by submitting VA Form 10-5345 to your local VA Medical Center. <a target="_blank" href="https://www.va.gov/vaforms/medical/pdf/vha-10-5345-fill.pdf">Download VA Form 10-5345.</a></li>
            <li>{requestQuestion}</li>
            <li>You can also submit <strong>medical records from a private practice doctor</strong>—contact your doctor’s office to get the records you need.</li>
          </ul>
        </li>
      );
    }
    return null;
  }

  renderStepThree() {
    const reasonCode = this.props.formValues['4_reason'];
    const noPrevApp = this.props.formValues['8_prevApplication'] === '2';
    const prevAppType = this.props.formValues['10_prevApplicationType'];
    const prevAppYear = this.props.formValues['9_prevApplicationYear'];
    const dischargeYear = this.props.formValues['2_dischargeYear'];
    const dischargeMonth = this.props.formValues['3_dischargeMonth'] || 1;
    const oldDischarge = moment().diff(moment([dischargeYear, dischargeMonth]), 'years', true) > 15;

    const boardToSubmit = board(this.props.formValues);

    let boardExplanation;
    let onlineSubmissionMsg;

    if (reasonCode === '8' && prevAppType !== '3') {
      boardExplanation = 'the Discharge Review Board (DRB). The DRB was the Board that granted your previous upgrade request, so you must apply to them for a new DD214.';
      if (oldDischarge) {
        boardExplanation = `the ${boardToSubmit.name}. The Board handles all cases from 15 or more years ago.`;
      }
    } else if (reasonCode === '8' && prevAppType === '3') {
      boardExplanation = `the ${boardToSubmit.name}. The ${boardToSubmit.abbr} was the Board that granted your previous upgrade request, so you must apply to them for a new DD214.`;
    } else if (prevAppYear === '1' && boardToSubmit.abbr === 'DRB') {
      return `the Discharge Review Board (DRB) for the ${this.props.formValues['1_branchOfService']}. In general, DRB does not handle appeals for previously denied applications. However, because new rules have recently come out regarding discharges like yours, the Boards may treat your application as a new case. If possible, review the new policies and state in your application how the change in the policy is relevant to your case. If the DRB decides that the new rules don't apply to your situation, you will likely have to send an appeal to a different Board.`;
    } else if (this.props.formValues['11_failureToExhaust'] && boardToSubmit.abbr === 'DRB') {
      return `the Discharge Review Board (DRB) for the ${this.props.formValues['1_branchOfService']}. The ${boardToSubmit.name} previously rejected your application because you applied to the DRB first. For applications like yours, the ${boardToSubmit.abbr} can review only cases that have already been rejected by the DRB. The DRB is a panel of commissioned officers, or a mix of senior non-commissioned officers (NCOs) and officers. The deadline to apply to the DRB is 15 years after your date of discharge. After this time period, you must apply to a different board.`;
    } else if (prevAppType === '2') {
      boardExplanation = `the ${boardToSubmit.abbr} for the ${branchOfService(this.props.formValues['1_branchOfService'])} to appeal that decision. This is because your application was denied by the Discharge Review Board (DRB) on a Personal Appearance Review.`;
    } else if (prevAppType === '3' && this.props.formValues['11_failureToExhaust'] !== '1') {
      boardExplanation = `the ${boardToSubmit.abbr}. This is because if you've applied before, you must re-apply to the ${boardToSubmit.abbr} for reconsideration.`;
    } else if ((noPrevApp || (['1', '4'].indexOf(prevAppType) > -1) || prevAppYear === '1') && oldDischarge) {
      boardExplanation = `the ${boardToSubmit.abbr} for the ${branchOfService(this.props.formValues['1_branchOfService'])}. This is because it handles all cases from 15 years ago and longer.`;
    } else if (this.props.formValues['7_courtMartial'] === '1') {
      boardExplanation = `the ${boardToSubmit.abbr} for the ${branchOfService(this.props.formValues['1_branchOfService'])}. This is because your discharge was the result of a General Court Martial.`;
    } else if (reasonCode === '5' || this.props.formValues['6_intention'] === '1') {
      boardExplanation = `the ${boardToSubmit.abbr} for the ${branchOfService(this.props.formValues['1_branchOfService'])}. This is because you're seeking to change information other than your discharge status, re-enlistment code, and narrative reason for discharge.`;
    } else if (boardToSubmit.abbr === 'DRB') {
      boardExplanation = `the DRB for the ${branchOfService(this.props.formValues['1_branchOfService'])}. ${prevAppType === '1' ? 'Because your application was rejected by the DRB on Documentary Review, you must apply for a Personal Appearance Review. The DRB is a panel of commissioned officers, or a combination of senior NCOs and officers. The deadline to apply to the DRB is 15 years after your date of discharge; after this time, you must apply to a different board.' : ''}`;
    }

    if (boardToSubmit.abbr === 'DRB' && this.props.formValues['1_branchOfService'] === 'army') {
      onlineSubmissionMsg = <p>You can also submit this information online at ACTSOnline. <a target="_blank" href="http://actsonline.army.mil/">Visit ACTSOnline to submit your information</a>.</p>;
    } else {
      onlineSubmissionMsg = <p>Unfortunately, there isn't a way to submit this form online.</p>;
    }

    return (
      <li className="list-group-item">
        <div>
          <h4>Mail your completed form and all supporting materials</h4>
          <p>There are a number of different boards that handle discharge upgrades and corrections. Based on your answers on the previous page, you need to apply to {boardExplanation}</p>
          {prevAppYear === '1' ? <p>Because your last application was made prior to the release of DoD guidance related to discharges like yours, DoD will effectively consider your application as a new application. Your previous application may be consulted for evidence, but usual rules about how to appeal previous decisions do not apply.</p> : null}
          <p>
            Mail your completed form and all supporting materials to the {boardToSubmit.abbr} at:
          </p>
          {venueAddress(this.props.formValues)}
          {onlineSubmissionMsg}
          <a href="#" onClick={this.handlePrint}>Print this page</a>
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
              <button className="usa-button-unstyled usa-accordion-button" aria-controls="dbq1" itemProp="name" name="q1" aria-expanded={!!this.state.q1} onClick={this.handleFAQToggle}>What happens after I send in my application?</button>
              <div id="dbq1" className="usa-accordion-content" itemProp="acceptedAnswer" itemScope itemType="http://schema.org/Answer" aria-hidden={!this.state.q1}>
                <div itemProp="text">
                  <p>Nearly all applications are reviewed by the Board within 18 months. You can continue to submit supporting documentation until the Board has reviewed your application.</p>
                  <p>If your application is successful, the Board will either issue you a DD-215, which contains updates to the DD-214, or an entirely new DD-214. If you get a new DD-214, <a target="_blank" href="https://www.dpris.dod.mil/veteranaccess.html">request a copy</a>.</p>
                  <p>If your appeal results in raising your discharge status to honorable, you will be immediately eligible for all VA benefits and services. In the meantime, you may still apply for VA eligibility by <a target="_blank" href="https://www.benefits.va.gov/BENEFITS/docs/COD_Factsheet.pdf">requesting a Character of Discharge review</a>.</p>
                </div>
              </div>
            </li>
            <li itemScope itemType="http://schema.org/Question">
              <button className="usa-button-unstyled usa-accordion-button" aria-controls="dbq2" itemProp="name" name="q2" aria-expanded={!!this.state.q2} onClick={this.handleFAQToggle}>Can I apply for VA benefits in the meantime?</button>
              <div id="dbq2" className="usa-accordion-content" itemProp="acceptedAnswer" itemScope itemType="http://schema.org/Answer" aria-hidden={!this.state.q2}>
                <div itemProp="text">
                  <AlertBox
                    isVisible
                    status="warning"
                    content={<p>Even with a less than honorable discharge, you may be able to still access some VA benefits through the <a target="_blank" href="https://www.benefits.va.gov/BENEFITS/docs/COD_Factsheet.pdf">Character of Discharge or Character of Service Determination process.</a></p>}/>
                  <p>If you have a discharge that is less than honorable, when you apply for VA benefits, it will trigger a review at VA. VA will review your record to determine if your service was "honorable for VA purposes."</p>
                  <p>You should receive a letter from VA letting you that they have begun to review your case. The VA handles these reviews on a case-by-case basis, and so they can take a long time — sometimes over a year. To access VA benefits, it helps to respond to this letter with information supporting your case. For example, if you’re asking VA to forgive your past behavior, provide evidence of positive steps you have taken in your life since your time in the service such as "buddy statements" or a certificate showing you've completed an drug rehabilitation program.</p>
                  <p>As with applying for a discharge upgrade, you may consider finding someone to advocate on your behalf (such as a lawyer or VSO) in collecting and submitting this evidence, depending on the complexity of your case.</p>
                  <p>Many veterans with less than honorable discharges pursue both methods: a VA characterization of discharge review, and a DoD discharge upgrade. There is no reason not to pursue both at the same time.</p>
                  <p>If you experienced sexual assault or harassment while in the military or need mental health services related to PTSD or other mental health conditions linked to your service, you may qualify for VA health benefits without a VA characterization of discharge review or a discharge upgrade.</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <h4>Additional Resources</h4><hr/>
        <ul>
          <li><a target="_blank" href="https://www.vets.gov/health-care/health-conditions/military-sexual-trauma/">VA health benefits for Veterans who experience military sexual trauma</a></li>
          <li><a target="_blank" href="https://www.vets.gov/health-care/health-conditions/mental-health/">VA health benefits for Veterans with mental health conditions</a></li>
          <li><a target="_blank" href="https://www.vets.gov/health-care/health-conditions/mental-health/ptsd/">VA health benefits for Veterans with PTSD</a></li>
          {this.props.formValues['1_branchOfService'] === 'army' && <li><a target="_blank" href="http://arba.army.pentagon.mil/adrb-overview.html">Army Discharge Review Board</a></li>}
          {['navy', 'marines'].includes(this.props.formValues['1_branchOfService']) && <li><a target="_blank" href="http://www.secnav.navy.mil/mra/CORB/pages/ndrb/default.aspx">Navy Discharge Review Board</a></li>}
          <li><a target="_blank" href="https://www.benefits.va.gov/BENEFITS/docs/COD_Factsheet.pdf">VA Guidance on COD Review</a></li>
        </ul>
      </div>
    );
  }

  renderDischargeWarning() {
    const boardToSubmit = board(this.props.formValues);
    const prevAppType = this.props.formValues['7_courtMartial'];

    const alertContent = (
      <p>Note: Because you answered that you're not sure if your discharge was the outcome of a General Court Martial, it's important for you to double check your military records. The results here are for Veterans who have discharges that are administrative, or the result of a Special or Summary Court Martial. If your discharge was the outcome of a General Court Martial, you may need to send your application to a different board. You can find out which board by editing your answers on the previous page.</p>
    );

    return (
      <AlertBox
        content={alertContent}
        isVisible={(boardToSubmit.abbr === 'DRB') && prevAppType === '3'}
        status="warning"/>
    );
  }

  renderApplicationWarning() {
    const prevAppType = this.props.formValues['10_prevApplicationType'];
    const reason = this.props.formValues['4_reason'];

    const alertContent = (
      <p>You answered that you weren't sure what type of application you made before. This guidance assumes your successful upgrade application was reviewed by the {branchOfService(this.props.formValues['1_branchOfService'])} Discharge Review Board (DRB). For more reliable information, please review your records to find out where you made your earlier application and complete the questions again.</p>
    );

    return (
      <AlertBox
        content={alertContent}
        isVisible={(reason === '8') && prevAppType === '3'}
        status="warning"/>
    );
  }

  render() {
    return (
      <div>
        <h1>Your Steps for Upgrading Your Discharge</h1>
        <div className="medium-8">
          <div className="va-introtext">
            <p>
              {this.renderResultSummary()}.
            </p>
          </div>
          <CarefulConsiderationStatement formValues={this.props.formValues}/>
          <AlertBox
            content={venueWarning}
            isVisible={this.props.formValues['10_prevApplicationType'] === '4'}
            status="warning"/>
          {this.renderDischargeWarning()}
          {this.renderApplicationWarning()}
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
