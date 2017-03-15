import React from 'react';
import { connect } from 'react-redux';
import { calculatorInputChange, showModal } from '../../actions';
import { getCalculatedBenefits } from '../../selectors/calculator';
import { formatCurrency } from '../../utils/helpers';
import EligibilityForm from '../search/EligibilityForm';
import CalculatorForm from '../profile/CalculatorForm';

const EligibilityDetails = ({ expanded, toggle }) => (
  <div className="eligibility-details">
    <button onClick={toggle} className="usa-button-outline">
      {expanded ? 'Hide' : 'Edit'} eligibility details
    </button>
    <div className="form-expanding-group-open">
      {expanded ? <EligibilityForm/> : null}
    </div>
  </div>
);

const CalculatorInputs = ({ expanded, toggle, inputs, displayedInputs, onInputChange, onShowModal }) => (
  <div className="calculator-inputs">
    <button onClick={toggle} className="usa-button-outline">
      {expanded ? 'Hide' : 'Edit'} calculator fields
    </button>
    <div className="form-expanding-group-open">
      {expanded ? <CalculatorForm
        inputs={inputs}
        displayedInputs={displayedInputs}
        onShowModal={onShowModal}
        onInputChange={onInputChange}/> : null}
    </div>
  </div>
);

const CalculatorResultRow = ({ label, value, labelClassName, valueClassName, visible }) => (visible ? (
  <div className="row calculator-result">
    <div className="small-8 columns">
      <p className={labelClassName}>{label}:</p>
    </div>
    <div className="small-4 columns value">
      <p className={valueClassName}>{value}</p>
    </div>
  </div>
) : null);

export class Calculator extends React.Component {

  constructor(props) {
    super(props);
    this.toggleEligibilityDetails = this.toggleEligibilityDetails.bind(this);
    this.toggleCalculatorForm = this.toggleCalculatorForm.bind(this);

    this.state = {
      showEligibilityDetails: false,
      showCalculatorForm: true,
    };
  }

  toggleEligibilityDetails() {
    this.setState({ showEligibilityDetails: !this.state.showEligibilityDetails });
  }

  toggleCalculatorForm() {
    this.setState({ showCalculatorForm: !this.state.showCalculatorForm });
  }

  render() {
    // const it = this.props.profile.attributes;
    const { outputs } = this.props.calculated;
    return (
      <div className="row calculate-your-benefits">
        <div className="medium-5 columns">
          <EligibilityDetails
              expanded={this.state.showEligibilityDetails}
              toggle={this.toggleEligibilityDetails}/>
          <CalculatorInputs
              inputs={this.props.calculator}
              displayedInputs={this.props.calculated.inputs}
              onInputChange={this.props.calculatorInputChange}
              onShowModal={this.props.showModal}
              expanded={this.state.showCalculatorForm}
              toggle={this.toggleCalculatorForm}/>
        </div>
        <div className="medium-1 columns">&nbsp;</div>
        <div className="medium-6 columns">
          <h3>Your estimated benefits</h3>
          <CalculatorResultRow
              label="Tuition and fees charged"
              value={formatCurrency(outputs.tuitionAndFeesCharged.value)}
              visible={outputs.tuitionAndFeesCharged.visible}/>
          <CalculatorResultRow
              label="GI Bill pays to school"
              value={formatCurrency(outputs.giBillPaysToSchool.value)}
              visible={outputs.giBillPaysToSchool.visible}/>
          <CalculatorResultRow
              label="Out of pocket tuition"
              value={formatCurrency(outputs.outOfPocketTuition.value)}
              valueClassName="bold"
              labelClassName="bold"
              visible={outputs.outOfPocketTuition.visible}/>
          <br/>
          <CalculatorResultRow
              label="Housing allowance"
              value={`${formatCurrency(outputs.housingAllowance.value)}/mo`}
              visible={outputs.housingAllowance.visible}/>
          <br/>
          <CalculatorResultRow
              label="Book stipend"
              value={formatCurrency(outputs.bookStipend.value)}
              visible={outputs.bookStipend.visible}/>
          <CalculatorResultRow
              label="Total paid to you"
              value={formatCurrency(outputs.totalPaidToYou.value)}
              valueClassName="bold"
              labelClassName="bold"
              visible={outputs.totalPaidToYou.visible}/>
          <hr/>
          <h3>Estimated benefits per term</h3>
          <h4>Tuition and fees</h4>
          <CalculatorResultRow label="Fall" value={'$38,205'}/>
          <CalculatorResultRow label="Spring" value={'$21,970'}/>
          <CalculatorResultRow label="Total per year" value={'$21,970'}/>
          <h4>Housing allowance</h4>
          <CalculatorResultRow label="Fall" value={'$38,205'}/>
          <CalculatorResultRow label="Spring" value={'$21,970'}/>
          <CalculatorResultRow label="Total per year" value={'$21,970'}/>
          <h4>Book stipend</h4>
          <CalculatorResultRow label="Fall" value={'$38,205'}/>
          <CalculatorResultRow label="Spring" value={'$21,970'}/>
          <CalculatorResultRow label="Total per year" value={'$21,970'}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    calculator: state.calculator,
    calculated: getCalculatedBenefits(state, props)
  };
};

const mapDispatchToProps = {
  calculatorInputChange,
  showModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(Calculator);
