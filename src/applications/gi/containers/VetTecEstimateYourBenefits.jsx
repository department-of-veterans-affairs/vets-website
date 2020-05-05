import React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { calculatorInputChange, beneficiaryZIPCodeChanged } from '../actions';
import { getCalculatedBenefits } from '../selectors/vetTecCalculator';
import VetTecCalculatorForm from '../components/vet-tec/VetTecCalculatorForm';
import PropTypes from 'prop-types';
import { ariaLabels } from '../constants';

export class VetTecEstimateYourBenefits extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tuitionFees: 0,
      scholarships: 0,
    };
  }

  housingAllowanceClassName =
    'small-4 columns vads-u-text-align--right small-screen:vads-u-padding-left--7';

  renderCalculatorForm = () => {
    const {
      calculator: inputs,
      calculated: { inputs: displayed },
    } = this.props;

    return (
      <div className="calculator-inputs vads-u-margin-x--neg1p5">
        <div>
          <VetTecCalculatorForm
            inputs={inputs}
            displayedInputs={displayed}
            onInputChange={this.props.calculatorInputChange}
            onBeneficiaryZIPCodeChanged={this.props.beneficiaryZIPCodeChanged}
            onShowModal={this.props.showModal}
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

  renderTuitionSection = (outputs, showModal) => (
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
          <div>
            <span>VA pays to provider: </span>
            <button
              aria-label={ariaLabels.learnMore.paysToProvider}
              type="button"
              className="va-button-link learn-more-button"
              onClick={() => showModal('payToProvider')}
            >
              (Learn more)
            </button>
          </div>
        </div>
        <div className="small-4 columns vads-u-text-align--right">
          <div className="estimated-benefit-values">
            {outputs.vaPaysToProvider}
          </div>
        </div>
      </div>
      <div className={'vads-u-margin-left--2p5'}>
        <div className="row vads-u-margin-top--0p5 small-screen:vads-u-padding-right--7">
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
        <div className="row vads-u-margin-top--0p5 small-screen:vads-u-padding-right--7">
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
        <div className="row vads-u-margin-top--0p5 small-screen:vads-u-padding-right--7">
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

  renderHousingSection = (outputs, showModal) => (
    <div className="housing-section">
      <div>
        <h4 className="vads-u-font-size--h5">Housing allowance</h4>{' '}
        <button
          aria-label={ariaLabels.learnMore.housingAllowance}
          type="button"
          className="va-button-link learn-more-button"
          onClick={() => showModal('housingAllowance')}
        >
          (Learn more)
        </button>
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

        <div className="row calculator-result">
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
      return <LoadingIndicator message="Loading your estimated benefits..." />;
    }
    const { outputs } = this.props.calculated;
    const { showModal } = this.props;
    return (
      <div className="vads-l-row calculate-your-benefits">
        <div className="usa-width-one-half medium-6 columns vads-u-padding--1p5 medium-screen:vads-u-padding--0">
          {this.renderCalculatorForm()}
        </div>
        <div className="usa-width-one-half medium-6 columns vads-u-padding--1p5 medium-screen:vads-u-padding--0">
          <div className=" your-estimated-benefits">
            <h3>Your estimated benefits</h3>
            <div className="program-name">
              {this.props.calculator.vetTecProgramName}
            </div>
            {this.renderTuitionSection(outputs, showModal)}
            <hr />
            {this.renderHousingSection(outputs, showModal)}
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
  calculatorInputChange,
  beneficiaryZIPCodeChanged,
};

VetTecEstimateYourBenefits.propTypes = {
  showModal: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VetTecEstimateYourBenefits);
