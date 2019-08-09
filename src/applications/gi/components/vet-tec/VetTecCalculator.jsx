import React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import {
  calculatorInputChange,
  beneficiaryZIPCodeChanged,
} from '../../actions';
import { getCalculatedBenefits } from '../../selectors/vetTecCalculator';
import VetTecCalculatorForm from './VetTecCalculatorForm';
import PropTypes from 'prop-types';

export class VetTecCalculator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tuitionFees: 0,
      scholarships: 0,
    };
  }

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
          <h5>Tuition & fees:</h5>
        </div>
        <div className="small-6 columns vads-u-text-align--right">
          <h5>{outputs.vetTecTuitionFees}</h5>
        </div>
      </div>
      {this.renderScholarshipBenefitSection(outputs)}
      <div className="row vads-u-margin-top--0p5">
        <div className="small-8 columns">
          <div>
            <span>VA pays to provider: </span>
            <button
              aria-label="pay to provider learn more"
              type="button"
              className="va-button-link learn-more-button"
              onClick={() => showModal('payToProvider')}
            >
              (Learn more)
            </button>
          </div>
        </div>
        <div className="small-4 columns vads-u-text-align--right">
          <div>{outputs.vaPaysToProvider}</div>
        </div>
      </div>
      <div className="row vads-u-margin-top--0p5 small-screen:vads-u-padding-right--7">
        <div className="small-7 small-screen:small-9 columns">
          <div>Upon enrollment in program (25%):</div>
        </div>
        <div className="small-5 xsmall-screen:small-3 vads-u-text-align--right columns value small-screen:vads-u-padding-left--7">
          <div>{outputs.quarterVetTecPayment}</div>
        </div>
      </div>
      <div className="row vads-u-margin-top--0p5 small-screen:vads-u-padding-right--7">
        <div className="small-7 small-screen:small-9 columns">
          <div>Upon completion of program (25%):</div>
        </div>
        <div className="small-5 xsmall-screen:small-3 vads-u-text-align--right columns value small-screen:vads-u-padding-left--7">
          <div>{outputs.quarterVetTecPayment}</div>
        </div>
      </div>
      <div className="row vads-u-margin-top--0p5 small-screen:vads-u-padding-right--7">
        <div className="small-7 small-screen:small-9 columns">
          <div>Upon employment (50%):</div>
        </div>
        <div className="small-5 xsmall-screen:small-3 vads-u-text-align--right columns value small-screen:vads-u-padding-left--7">
          <div>{outputs.halfVetTecPayment}</div>
        </div>
      </div>

      <div className="row vads-u-margin-top--0p5">
        <div className="small-6 columns">
          <h5 className="vads-u-font-family--sans">Out of pocket tuition:</h5>
        </div>
        <div className="small-6 columns vads-u-text-align--right">
          <h5 className="vads-u-font-family--sans">
            {outputs.outOfPocketTuitionFees}
          </h5>
        </div>
      </div>
    </div>
  );

  renderHousingSection = (outputs, showModal) => (
    <div className="housing-section">
      <div className="link-header">
        <h5>Housing allowance</h5>{' '}
        <button
          aria-label="housing allowance learn more"
          type="button"
          className="va-button-link learn-more-button"
          onClick={() => showModal('housingAllowance')}
        >
          (Learn more)
        </button>
      </div>

      <div className="row calculator-result">
        <div className="small-8 columns">
          <div>In person rate:</div>
        </div>
        <div className="small-4 columns vads-u-text-align--right small-screen:vads-u-padding-left--7">
          <div>{outputs.inPersonRate}</div>
        </div>
      </div>

      <div className="row calculator-result">
        <div className="small-8 columns">
          <div>Online rate:</div>
        </div>
        <div className="small-4 columns vads-u-text-align--right small-screen:vads-u-padding-left--7">
          <div>{outputs.onlineRate}</div>
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
        <div className="usa-width-five-twelfths medium-5 columns">
          {this.renderCalculatorForm()}
        </div>
        <div className="usa-width-one-twelfth medium-1 columns">&nbsp;</div>
        <div className="usa-width-one-half medium-6 columns vads-u-padding--0">
          <div className=" your-estimated-benefits">
            <h3>Your estimated benefits</h3>
            <i>Tuition and fees data will be available soon.</i>
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

VetTecCalculator.propTypes = {
  showModal: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VetTecCalculator);
