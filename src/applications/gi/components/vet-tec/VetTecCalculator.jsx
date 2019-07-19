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
      <div className="calculator-inputs">
        <div className="form-expanding-group-open">
          <VetTecCalculatorForm
            inputs={inputs}
            displayedInputs={displayed}
            onInputChange={this.props.calculatorInputChange}
            onBeneficiaryZIPCodeChanged={this.props.beneficiaryZIPCodeChanged}
          />
        </div>
      </div>
    );
  };

  renderTuitionSection = outputs => (
    <div className="tuition-section">
      <div className="row vads-u-margin-top--0p5">
        <div className="small-6 columns">
          <h5>Tuition & fees:</h5>
        </div>
        <div className="small-6 columns vads-u-text-align--right">
          <h5>{outputs.vetTecTuitionFees}</h5>
        </div>
      </div>

      <div className="row vads-u-margin-top--0p5">
        <div className="small-6 columns">
          <div>Your scholarships:</div>
        </div>
        <div className="small-6 columns vads-u-text-align--right">
          <div>{outputs.vetTecScholarships}</div>
        </div>
      </div>

      <div className="row vads-u-margin-top--0p5">
        <div className="small-8 columns">
          <div>
            VA pays to provider:{' '}
            <a href="" target="_blank" rel="noopener noreferrer">
              (Learn more)
            </a>
          </div>
        </div>
        <div className="small-4 columns vads-u-text-align--right">
          <div>{outputs.vaPaysToProvider}</div>
        </div>
      </div>

      <div className="row vads-u-margin-top--0p5 va-payment">
        <div className="small-9 columns">
          <div>Upon enrollment in program (25%):</div>
        </div>
        <div className="small-3 columns vads-u-text-align--right">
          <div>{outputs.quarterVetTecPayment}</div>
        </div>
      </div>

      <div className="row vads-u-margin-top--0p5 va-payment">
        <div className="small-9 columns">
          <div>Upon completion of program (25%):</div>
        </div>
        <div className="small-3 columns vads-u-text-align--right">
          <div>{outputs.quarterVetTecPayment}</div>
        </div>
      </div>

      <div className="row vads-u-margin-top--0p5 va-payment">
        <div className="small-9 columns">
          <div>Upon employment (50%):</div>
        </div>
        <div className="small-3 columns vads-u-text-align--right">
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

  renderHousingSection = outputs => (
    <div className="housing-section">
      <div className="link-header">
        <h5>Housing Allowance:</h5>{' '}
        <a href="" target="_blank" rel="noopener noreferrer">
          (Learn more)
        </a>
      </div>

      <div className="row calculator-result">
        <div className="small-8 columns">
          <div>In person rate:</div>
        </div>
        <div className="small-4 columns">
          <div>{outputs.inPersonRate}</div>
        </div>
      </div>

      <div className="row calculator-result">
        <div className="small-8 columns">
          <div>Online rate:</div>
        </div>
        <div className="small-4 columns">
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
    return (
      <div className="row calculate-your-benefits">
        <div className="usa-width-five-twelfths medium-5 columns">
          {this.renderCalculatorForm()}
        </div>
        <div className="medium-1 columns">&nbsp;</div>
        <div className="usa-width-one-half medium-6 columns your-estimated-benefits">
          <h3>Your estimated benefits</h3>
          <i>(Tuition & fees data will soon be available)</i>
          {this.renderTuitionSection(outputs)}
          <hr />
          {this.renderHousingSection(outputs)}
        </div>
        <div className="medium-7 columns">
          <p>
            <strong>Note:</strong> Your GI Bill benefit days remaining will not
            be used by VET TEC.
          </p>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VetTecCalculator);
