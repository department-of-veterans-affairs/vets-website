import React from 'react';
import { connect } from 'react-redux';
import { showModal } from '../../actions';
import { calculatedBenefits } from '../../selectors/calculator';
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

const CalculatorInputs = ({ expanded, toggle }) => (
  <div className="calculator-inputs">
    <button onClick={toggle} className="usa-button-outline">
      {expanded ? 'Hide' : 'Edit'} calculator fields
    </button>
    <div className="form-expanding-group-open">
      {expanded ? <CalculatorForm/> : null}
    </div>
  </div>
);

const CalculatorResultRow = ({ label, value, labelClassName, valueClassName }) => (
  <div className="row calculator-result">
    <div className="small-8 columns">
      <p className={labelClassName}>{label}:</p>
    </div>
    <div className="small-4 columns value">
      <p className={valueClassName}>{value}</p>
    </div>
  </div>
);

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
              expanded={this.state.showCalculatorForm}
              toggle={this.toggleCalculatorForm}/>
        </div>
        <div className="medium-1 columns">&nbsp;</div>
        <div className="medium-6 columns">
          <h3>Your estimated benefits</h3>
          <CalculatorResultRow label="Tuition and fees charged" value={outputs.tuitionAndFeesCharged.value}/>
          <CalculatorResultRow label="GI Bill pays to school" value={outputs.giBillPaysToSchool.value}/>
          <CalculatorResultRow label="Out of pocket tuition" value={outputs.outOfPocketTuition.value} valueClassName="bold" labelClassName="bold"/>
          <br/>
          <CalculatorResultRow label="Housing allowance" value={`${outputs.housingAllowance.value}/mo`}/>
          <CalculatorResultRow label="Book stipend" value={outputs.bookStipend.value}/>
          <CalculatorResultRow label="Total paid to you" value={outputs.totalPaidToYou.value} valueClassName="bold" labelClassName="bold"/>
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
    calculated: calculatedBenefits(state, props)
  };
};

const mapDispatchToProps = {
  showModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(Calculator);
