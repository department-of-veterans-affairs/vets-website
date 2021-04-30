import { connect } from 'react-redux';
import React, { Component } from 'react';
import moment from 'moment';
import recordEvent from 'platform/monitoring/record-event';
import localStorage from 'platform/utilities/storage/localStorage';

// Relative imports
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import CarefulConsiderationStatement from '../components/CarefulConsiderationStatement';
import StepOne from '../components/steps/StepOne';
import StepTwo from '../components/steps/StepTwo';
import { branchOfService, board, formData } from '../helpers';
import { venueWarning, upgradeVenueWarning } from '../constants';
import StepThree from '../components/steps/StepThree';

export class GuidancePage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    localStorage.setItem('dw-viewed-guidance', true);
    localStorage.setItem(
      'dw-formValues',
      JSON.stringify(this.props.formValues),
    );

    if (sessionStorage.getItem('dw-session-started')) {
      sessionStorage.removeItem('dw-session-started');
    } else {
      this.props.router.push('/');
    }

    const el = document.getElementById('dw-home-link');
    if (el) {
      el.focus();
    }

    window.scrollTo(0, 0);
  }

  handleFAQToggle = e => {
    e.preventDefault();
    recordEvent({ event: 'discharge-upgrade-faq-toggle' });
    this.setState({
      [e.target.name]: !this.state[e.target.name],
    });
  };

  handlePrint(e) {
    e.preventDefault();
    recordEvent({ event: 'discharge-upgrade-print' });
    if (window.print) {
      window.print();
    }
  }

  renderResultSummary() {
    const forReconsideration =
      this.props.formValues['10_prevApplicationType'] === '3' &&
      this.props.formValues['11_failureToExhaust'] !== '1';
    return `Based on your answers, you need to complete Department of Defense (DoD) Form ${
      formData(this.props.formValues).num
    } and send it to the ${
      board(this.props.formValues).name
    } for the ${branchOfService(this.props.formValues['1_branchOfService'])}${
      forReconsideration ? ' for reconsideration' : ''
    }`;
  }

  renderOptionalStep() {
    const validReason =
      ['1', '2'].indexOf(this.props.formValues['4_reason']) > -1;
    const dischargeYear = parseInt(
      this.props.formValues['2_dischargeYear'],
      10,
    );
    const validYear = dischargeYear >= 2001 && dischargeYear <= 2009;

    if (validReason && validYear) {
      return (
        <div className="feature">
          <h4>
            (Optional): Apply to the Physical Disability Board of Review (PDBR)
          </h4>
          <p>
            If you believe your disability rating for TBI, PTSD, or mental
            health conditions is too low, consider applying to the Physical
            Disability Board of Review (PDBR). The DoD created the PDBR
            specifically to review appeals about low disability ratings for
            Veterans discharged between 2001 and 2009. Some Veterans discharged
            during this period of time received lower disability ratings than
            they deserved, especially if they suffered from TBI, PTSD, or other
            mental health conditions. If you were discharged during this period
            of time and previously received a disability rating of 20% or lower,
            you’re eligible to apply to the PDBR for review. The PDBR does not
            issue discharge upgrades and cannot review conditions not listed in
            your military record before your separation. But, if the PDBR finds
            that your disability rating was unjustly low, it may help you make
            your case to upgrade your discharge.{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://health.mil/PDBR"
            >
              Learn more about PBDR reviews
            </a>
            .{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://health.mil/Military-Health-Topics/Conditions-and-Treatments/Physical-Disability/Disability-Evaluation/Physical-Disability-Board-of-Review/PDBR-Application-Process"
            >
              Apply for a PBDR review
            </a>
            .
          </p>
        </div>
      );
    }
    return null;
  }

  renderAddlInstructions() {
    return (
      <div>
        <div className="usa-accordion accordion-container">
          <ul className="usa-unstyled-list">
            <li itemScope itemType="http://schema.org/Question">
              <button
                className="usa-button-unstyled usa-accordion-button"
                aria-controls="dbq1"
                itemProp="name"
                name="q1"
                aria-expanded={!!this.state.q1}
                onClick={this.handleFAQToggle}
              >
                What happens after I send in my application?
              </button>
              <div
                id="dbq1"
                className="usa-accordion-content"
                itemProp="acceptedAnswer"
                itemScope
                itemType="http://schema.org/Answer"
                aria-hidden={!this.state.q1}
              >
                <div itemProp="text">
                  <p>
                    The Board reviews nearly all applications within 18 months.
                    You can continue to submit supporting documentation until
                    the Board has reviewed your application.
                  </p>
                  <p>
                    If your application is successful, the Board will direct
                    your service personnel office to issue you either a DD215,
                    which contains updates to the DD214, or an entirely new
                    DD214. If you get a new DD214,{' '}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://www.dpris.dod.mil/veteranaccess.html"
                    >
                      request a copy
                    </a>
                    .
                  </p>
                  <p>
                    If your appeal results in raising your discharge to
                    honorable, you’ll immediately be considered an eligible
                    Veteran to VA, and you can apply for VA benefits and
                    services. For now, you may still apply for VA eligibility by{' '}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://www.benefits.va.gov/BENEFITS/docs/COD_Factsheet.pdf"
                    >
                      requesting a Character of Discharge review
                    </a>
                    .
                  </p>
                </div>
              </div>
            </li>
            <li itemScope itemType="http://schema.org/Question">
              <button
                className="usa-button-unstyled usa-accordion-button"
                aria-controls="dbq2"
                itemProp="name"
                name="q2"
                aria-expanded={!!this.state.q2}
                onClick={this.handleFAQToggle}
              >
                Can I get VA benefits without a discharge upgrade?
              </button>
              <div
                id="dbq2"
                className="usa-accordion-content"
                itemProp="acceptedAnswer"
                itemScope
                itemType="http://schema.org/Answer"
                aria-hidden={!this.state.q2}
              >
                <div itemProp="text">
                  <p>
                    Even with a less than honorable discharge, you may be able
                    to access some VA benefits through the Character of
                    Discharge review process. When you apply for VA benefits,
                    we’ll review your record to determine if your service was
                    “honorable for VA purposes.” This review can take up to a
                    year. Please provide us with documents supporting your case,
                    similar to the evidence you’d send with an application to
                    upgrade your discharge.
                  </p>
                  <p>
                    You may want to consider finding someone to advocate on your
                    behalf, depending on the complexity of your case. A lawyer
                    or Veterans Service Organization (VSO) can collect and
                    submit supporting documents for you.{' '}
                    <a href="https://www.benefits.va.gov/vso/varo.asp">
                      Find a VSO near you.
                    </a>
                  </p>
                  <p>
                    <strong>Note:</strong> You can ask for a VA Character of
                    Discharge review while at the same time applying for a
                    discharge upgrade from the Department of Defense (DoD) or
                    the Coast Guard.
                  </p>
                  <p>
                    If you experienced sexual assault or harassment while in the
                    military, or need mental health services related to PTSD or
                    other mental health conditions linked to your service, you
                    may qualify immediately for VA health benefits, even without
                    a VA Character of Discharge review or a discharge upgrade.
                  </p>
                  <p>Learn more about:</p>
                  <ul>
                    <li>
                      <a href="/health-care/health-needs-conditions/military-sexual-trauma/">
                        VA health benefits for Veterans who have experienced
                        military sexual trauma
                      </a>
                    </li>
                    <li>
                      <a href="/health-care/health-needs-conditions/mental-health/">
                        VA health benefits for Veterans with mental health
                        conditions
                      </a>
                    </li>
                    <li>
                      <a href="/health-care/health-needs-conditions/mental-health/ptsd/">
                        VA health benefits for Veterans with PTSD
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <h4>Additional Resources</h4>
        <hr />
        {this.renderAdditionalResources()}
        <p>
          <strong>Please note:</strong> This information was created based on
          how you answered the questions on the previous page. This information
          will not be specific to someone with different answers to the
          questions.
        </p>
      </div>
    );
  }

  renderAdditionalResources() {
    const serviceBranch = this.props.formValues['1_branchOfService'];

    return (
      <ul>
        <li>
          <a
            target="_blank"
            href="/health-care/health-needs-conditions/military-sexual-trauma/"
          >
            VA health benefits for Veterans who experience military sexual
            trauma
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="/health-care/health-needs-conditions/mental-health/"
          >
            VA health benefits for Veterans with mental health conditions
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="/health-care/health-needs-conditions/mental-health/ptsd/"
          >
            VA health benefits for Veterans with PTSD
          </a>
        </li>
        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.benefits.va.gov/BENEFITS/docs/COD_Factsheet.pdf"
          >
            VA Guidance on Character of Discharge Reviews
          </a>
        </li>
        {serviceBranch === 'army' && (
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://arba.army.pentagon.mil"
            >
              Army Review Boards Agency
            </a>
          </li>
        )}
        {serviceBranch === 'army' &&
          board(this.props.formValues).abbr === 'DRB' && (
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="http://arba.army.pentagon.mil/adrb-overview.html"
              >
                Army Discharge Review Board
              </a>
            </li>
          )}
        {serviceBranch === 'army' &&
          board(this.props.formValues).abbr === 'BCMR' && (
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="http://arba.army.pentagon.mil/abcmr-overview.html"
              >
                Army Board for Correction of Military Records
              </a>
            </li>
          )}
        {['navy', 'marines'].includes(serviceBranch) && (
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.secnav.navy.mil/mra/CORB/pages/ndrb/default.aspx"
            >
              Naval Discharge Review Board
            </a>
          </li>
        )}
        {serviceBranch === 'airForce' &&
          board(this.props.formValues).abbr === 'BCMR' && (
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="http://www.afpc.af.mil/Board-for-Correction-of-Military-Records/"
              >
                Air Force Board for Correction of Military Records
              </a>
            </li>
          )}
        {serviceBranch === 'coastGuard' &&
          board(this.props.formValues).abbr === 'BCMR' && (
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.uscg.mil/Resources/legal/BCMR/"
              >
                Coast Guard Board for Correction of Military Records
              </a>
            </li>
          )}
        {serviceBranch === 'coastGuard' &&
          board(this.props.formValues).abbr === 'DRB' && (
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.uscg.mil/Resources/Legal/DRB.aspx/"
              >
                Coast Guard Discharge Review Board
              </a>
            </li>
          )}
      </ul>
    );
  }

  renderDischargeWarning() {
    const boardToSubmit = board(this.props.formValues);
    const prevAppType = this.props.formValues['7_courtMartial'];

    const alertContent = (
      <p>
        Because you answered that you’re not sure if your discharge was the
        outcome of a general court-martial, it’s important for you to check your
        military records. The results below are for Veterans who have discharges
        that are administrative or the result of a special or summary
        court-martial.
      </p>
    );

    return (
      <AlertBox
        content={alertContent}
        isVisible={boardToSubmit.abbr === 'DRB' && prevAppType === '3'}
        status="warning"
      />
    );
  }

  renderApplicationWarning() {
    const prevAppType = this.props.formValues['10_prevApplicationType'];
    const reason = this.props.formValues['4_reason'];

    const alertContent = (
      <p>
        Because you answered that you weren’t sure where you applied for an
        upgrade before, it’s important for you to check your records. The
        instructions below are for Veterans who had a successful upgrade
        application reviewed by the{' '}
        {branchOfService(this.props.formValues['1_branchOfService'])} Discharge
        Review Board (DRB).
      </p>
    );

    return (
      <AlertBox
        content={alertContent}
        isVisible={reason === '8' && prevAppType === '3'}
        status="warning"
      />
    );
  }

  renderVenueWarnings() {
    const { formValues } = this.props;
    const prevAppType = formValues['10_prevApplicationType'];
    const reason = formValues['4_reason'];
    const dischargeYear = formValues['2_dischargeYear'];
    const dischargeMonth = formValues['3_dischargeMonth'] || 1;
    const oldDischarge =
      moment().diff(moment([dischargeYear, dischargeMonth]), 'years', true) >=
      15;

    return (
      <div>
        <AlertBox
          content={venueWarning}
          isVisible={prevAppType === '4' && reason !== '8'}
          status="warning"
        />
        <AlertBox
          content={upgradeVenueWarning}
          isVisible={prevAppType === '4' && reason === '8' && !oldDischarge}
          status="warning"
        />
      </div>
    );
  }

  render() {
    return (
      <div className="dw-guidance">
        <h1>Your Steps for Upgrading Your Discharge</h1>
        <div className="medium-8">
          <div className="va-introtext">
            <p>{this.renderResultSummary()}.</p>
          </div>
          <CarefulConsiderationStatement formValues={this.props.formValues} />
          {this.renderVenueWarnings()}
          {this.renderDischargeWarning()}
          {this.renderApplicationWarning()}
          {this.renderOptionalStep()}
          <ul className="steps-list vertical-list-group more-bottom-cushion numbered">
            <StepOne formValues={this.props.formValues} />
            <StepTwo formValues={this.props.formValues} />
            <StepThree
              formValues={this.props.formValues}
              handlePrint={this.handlePrint}
            />
          </ul>
          {this.renderAddlInstructions()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  formValues: state.dischargeWizard.form,
});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GuidancePage);
