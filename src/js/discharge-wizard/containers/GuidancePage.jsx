import { connect } from 'react-redux';
import React from 'react';

import AlertBox from '../../common/components/AlertBox';
import CarefulConsiderationStatement from '../components/CarefulConsiderationStatement';
import { branchOfService, board, formNumber } from '../utils';
import { venueWarning } from '../config';

class GuidancePage extends React.Component {
  renderResultSummary() {
    const forReconsideration = this.props.formValues['10_prevApplicationType'] === '3';
    return `You need to complete Department of Defense (DoD) Form ${formNumber(this.props.formValues)} and send it to the ${board(this.props.formValues).name} for the ${branchOfService(this.props.formValues['7_branchOfService'])}${forReconsideration ? ' for reconsideration' : ''}`;
  }

  renderOptionalStep() {
    const validReason = ['1', '2'].indexOf(this.props.formValues['1_reason']) > -1;
    const dischargeYear = parseInt(this.props.formValues['4_dischargeYear'], 10);
    const validYear = dischargeYear >= 2001 && dischargeYear <= 2009;

    if (validReason && validYear) {
      return (
        <li className="list-group-item">
          <div>
            <h4>(Optional): Apply to the Physical Disability Board of Review (PDBR)</h4>
            <p>
              The Department of Defense (DoD) created the Physical Disability Board of Review (PDBR) specifically to review appeals about low disability ratings for Veterans discharged between 2001 and 2009.  Many Veterans discharged during this time period were inaccurately given lower disability ratings than they deserved, especially if they suffered from TBI, PTSD, or mental health conditions. If you were discharged in this period and previously received a disability rating for PTSD which you feel is too low, you are eligible to apply to the PDBR for review. The PDBR does not issue discharge status upgrades—but if the PDBR finds that your disability rating was unjustly low, this may help you make your case to upgrade your discharge status. Many Veterans in this situation choose to <a href="http://www.health.mil/PDBR">make a PDBR application</a> before applying for a discharge upgrade. <a href="https://health.mil/Military-Health-Topics/Conditions-and-Treatments/Physical-Disability/Disability-Evaluation/Physical-Disability-Board-of-Review/PDBR-Application-Process">Apply for a PBDR review</a>.
            </p>
          </div>
        </li>
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

    const formNum = formNumber(this.props.formValues);
    return (
      <li className="list-group-item">
        <div>
          <h4>Download and fill out DoD Form {formNum}</h4>
          <p>
            Important tips for completing Form {formNum}:
          </p>
          <ul>
            <li>Pay special attention to item 6, which asks for the reason for your change. Most Veterans attach additional pages to answer this question. {strongCaseTips()}</li>
            {this.props.formValues['10_prevApplicationType'] === '3' && <li>Because you are applying for reconsideration of a previous application, you will need to enter the previous application number in Item 6b. Note that you are generally only eligible for reconsideration if you have new evidence to present, which was not available at the time of your last application. Make sure you clarify exactly what that new evidence entails.</li>}
            {boardToSubmit.abbr !== 'DRB' && <li>Item 8 asks for your date of “discovery” of the injustice. If this date isn’t in the last 3 years, you’ll need to argue that the Board should hear your case anyway. This is not a strict date, so don’t let the 3-year rule keep you from applying if you have a strong case. You may note your recent discovery of new evidence about your claim or recent policy changes (like careful consideration for PTSD, TBI, or military sexual assault or harassment.</li>}
            {boardToSubmit.abbr !== 'DRB' && <li>Item 10 asks if you are willing to appear in-person before the Board. The Board rarely asks Veterans to appear in person, but indicating that you’re willing to do so may help show how serious you are about your case.</li>}
            {boardToSubmit.abbr === 'DRB' && this.props.formValues['10_prevApplicationType'] !== '1' && <li>You can request either a Documentary Review or Personal Appearance Review from the Discharge Review Board (DRB). If your case is especially complicated and requires detailed explanation, you MAY have more success with a Personal Appearance Review, but know that you will not be reimbursed for your travel costs. Documentary Reviews are generally faster and so it is usually recommended to begin with one. Also, if you are denied in a Documentary Review, you can then appeal via Personal Appearance, but you can’t request Documentary Review after a Personal Appearance.</li>}
            {boardToSubmit.abbr === 'DRB' && this.props.formValues['10_prevApplicationType'] === '1' && <li>The DRB allows you to request either a Documentary Review or a Personal Appearance Review. Because your application was already denied during a Documentary Review, you must apply for a Personal Appearance Review.</li>}
          </ul>
          <a href="#" className="usa-button-primary va-button">Download Form {formNum}</a>
          <AlertBox
            content={<div>
              <h4>Need Help?</h4>
              <p>The process of preparing a discharge upgrade or correction application can sometimes be a lot of work and take a long time. Although many Veterans are successful by themselves, it may be helpful to find someone to advocate for you in this process. Try a VSO, search online for a lawyer who may provide services for low or no cost, or ask other Veterans for recommendations.</p>
            </div>}
            isVisible={this.props.formValues['10_prevApplicationType'] === '4'}
            status="warning"/>
        </div>
      </li>
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
          <ul className="vertical-list-group more-bottom-cushion">
            {this.renderOptionalStep()}
            {this.renderStepOne()}
          </ul>
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
