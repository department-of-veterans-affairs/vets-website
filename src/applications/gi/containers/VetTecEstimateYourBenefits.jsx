import React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import {
  beneficiaryZIPCodeChanged,
  calculatorInputChange,
  showModal,
} from '../actions';
import { getCalculatedBenefits } from '../selectors/vetTecCalculator';
import VetTecEstimateYourBenefitsForm from '../components/vet-tec/VetTecEstimateYourBenefitsForm';
import { ariaLabels } from '../constants';
import LearnMoreLabel from '../components/LearnMoreLabel';

export class VetTecEstimateYourBenefits extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tuitionFees: 0,
      scholarships: 0,
    };
  }

  housingAllowanceClassName =
    'small-4 columns vads-u-text-align--right mobile-lg:vads-u-padding-left--7';

  renderLearnMoreLabel = ({ text, modal, ariaLabel }) => (
    <LearnMoreLabel
      text={text}
      onClick={() => this.props.showModal(modal)}
      ariaLabel={ariaLabel}
    />
  );

  renderCalculatorForm = () => {
    return (
      <div className="calculator-inputs vads-u-margin-x--neg1p5">
        <div>
          <VetTecEstimateYourBenefitsForm
            inputs={this.props.calculator}
            showModal={this.props.showModal}
            institution={this.props.institution}
            selectedProgram={this.props.selectedProgram}
            handleSelectedProgram={this.handleSelectedProgram}
            calculatorInputChange={this.props.calculatorInputChange}
          />
        </div>
      </div>
    );
  };

  renderScholarshipBenefitSection = outputs => {
    if (outputs.vetTecScholarships === '$0') return null;
    return (
      <div className="row vads-u-margin-top--0p5">
        <div className="small-6 columns">
          <div>Your scholarships:</div>
        </div>
        <div className="small-6 columns vads-u-text-align--right">
          <div>{outputs.vetTecScholarships}</div>
        </div>
      </div>
    );
  };

  renderTuitionSection = outputs => (
    <div className="tuition-section">
      <div className="row vads-u-margin-top--0p5">
        <div className="small-6 columns">
          <h4 className="vads-u-font-size--h5">Tuition & fees:</h4>
        </div>
        <div className="small-6 columns vads-u-text-align--right">
          <h5 className="estimated-benefit-values">
            {outputs.vetTecTuitionFees}
          </h5>
        </div>
      </div>
      {this.renderScholarshipBenefitSection(outputs)}
      <div className="row vads-u-margin-top--0p5">
        <div className="small-8 columns">
          {this.renderLearnMoreLabel({
            text: 'VA pays to provider:',
            modal: 'payToProvider',
            ariaLabel: ariaLabels.learnMore.paysToProvider,
          })}
        </div>
        <div className="small-4 columns vads-u-text-align--right">
          <div className="estimated-benefit-values">
            {outputs.vaPaysToProvider}
          </div>
        </div>
      </div>
      <div className="vads-u-margin-left--2p5">
        <div className="row vads-u-margin-top--0p5 mobile-lg:vads-u-padding-right--7">
          <div className="small-9 small-screen:small-9 columns">
            <div>
              Upon enrollment in program{' '}
              <span className="sr-only">VA pays to provider</span>
              (25%):
            </div>
          </div>
          <div className="small-3 xsmall-screen:small-2 vads-u-text-align--right columns value">
            <div className="estimated-benefit-values">
              {outputs.quarterVetTecPayment}
            </div>
          </div>
        </div>
        <div className="row vads-u-margin-top--0p5 mobile-lg:vads-u-padding-right--7">
          <div className="small-9 small-screen:small-9 columns">
            <div>
              Upon completion of program{' '}
              <span className="sr-only">VA pays to provider</span>
              (25%):
            </div>
          </div>
          <div className="small-3 xsmall-screen:small-2 vads-u-text-align--right columns value">
            <div className="estimated-benefit-values">
              {outputs.quarterVetTecPayment}
            </div>
          </div>
        </div>
        <div className="row vads-u-margin-top--0p5 mobile-lg:vads-u-padding-right--7">
          <div className="small-9 small-screen:small-9 columns">
            <div>
              Upon employment{' '}
              <span className="sr-only">VA pays to provider</span>
              (50%):
            </div>
          </div>
          <div className="small-3 xsmall-screen:small-2 vads-u-text-align--right columns value">
            <div className="estimated-benefit-values">
              {outputs.halfVetTecPayment}
            </div>
          </div>
        </div>
      </div>
      <div className="row vads-u-margin-top--0p5 vads-u-margin-bottom--neg0p5">
        <div className="small-6 columns">
          <h4 className="vads-u-font-family--sans vads-u-font-size--h5 vads-u-margin-bottom--0">
            Out of pocket tuition:
          </h4>
        </div>
        <div className="small-6 columns vads-u-text-align--right">
          <h5 className="vads-u-font-family--sans estimated-benefit-values vads-u-margin-bottom--0">
            {outputs.outOfPocketTuitionFees}
          </h5>
        </div>
      </div>
    </div>
  );

  renderHousingSection = outputs => (
    <div className="housing-section">
      <div>
        <h4 className="vads-u-font-size--h5">Housing allowance</h4>{' '}
        {this.renderLearnMoreLabel({
          modal: 'housingAllowance',
          ariaLabel: ariaLabels.learnMore.housingAllowance,
        })}
      </div>
      <div>
        <div className="row calculator-result">
          <div className="small-8 columns">
            <div>In-person monthly rate:</div>
          </div>
          <div className={this.housingAllowanceClassName}>
            <div>{outputs.inPersonRate}</div>
          </div>
        </div>

        <div className="row calculator-result vads-u-padding-bottom--2p5">
          <div className="small-8 columns">
            <div>Online monthly rate:</div>
          </div>
          <div className={this.housingAllowanceClassName}>
            <div>{outputs.onlineRate}</div>
          </div>
        </div>
      </div>
    </div>
  );

  render() {
    if (isEmpty(this.props.calculated)) {
      return (
        <VaLoadingIndicator
          data-testid="loading-indicator"
          message="Loading your estimated benefits..."
        />
      );
    }
    const { outputs } = this.props.calculated;

    return (
      <div className="vads-l-row calculate-your-benefits">
        <div className="usa-width-one-half medium-6 columns vads-u-padding--1p5 medium-screen:vads-u-padding--0">
          {this.renderCalculatorForm()}
        </div>
        <div className="usa-width-one-half medium-6 columns vads-u-padding--1p5 medium-screen:vads-u-padding--0">
          <div
            aria-atomic="true"
            aria-live="polite"
            role="status"
            className="your-estimated-benefits"
          >
            <h3
              id="estimated-benefits-header"
              className="estimated-benefits-header"
            >
              Your estimated benefits
            </h3>
            <div className="program-name">
              {this.props.calculator.vetTecProgramName}
            </div>
            {this.renderTuitionSection(outputs)}
            <hr aria-hidden="true" />
            {this.renderHousingSection(outputs)}
          </div>
          <div>
            <p>
              <strong>Note:</strong> Your VET TEC training won't count against
              your GI Bill entitlement.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  calculator: state.calculator,
  calculated: getCalculatedBenefits(state, props),
});

const mapDispatchToProps = {
  beneficiaryZIPCodeChanged,
  calculatorInputChange,
  showModal,
};

VetTecEstimateYourBenefits.propTypes = {
  institution: PropTypes.object,
  selectedProgram: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VetTecEstimateYourBenefits);
