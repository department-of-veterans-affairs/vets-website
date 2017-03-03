import React from 'react';
import { connect } from 'react-redux';
import { showModal } from '../../actions';
import EligibilityForm from '../search/EligibilityForm';
import CalculatorForm from '../profile/CalculatorForm';

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
    const EligibilityDetails = ({ expanded }) => (
      <div className="eligibility-details">
        <button onClick={this.toggleEligibilityDetails} className="usa-button-outline">
          {expanded ? 'Hide' : 'Edit'} eligibility details
        </button>
        <div className="form-expanding-group-open">
          {expanded ? <EligibilityForm/> : null}
        </div>
      </div>
    );
    const CalculatorInputs = ({ expanded }) => (
      <div className="calculator-inputs">
        <button onClick={this.toggleCalculatorForm} className="usa-button-outline">
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
    return (
      <div className="row calculate-your-benefits">
        <div className="medium-5 columns">
          <EligibilityDetails expanded={this.state.showEligibilityDetails}/>
          <CalculatorInputs expanded={this.state.showCalculatorForm}/>
        </div>
        <div className="medium-1 columns">&nbsp;</div>
        <div className="medium-6 columns">
          <h3>Your estimated benefits</h3>
          <CalculatorResultRow label="Tuition and fees charged" value={'$38,205'}/>
          <CalculatorResultRow label="GI Bill pays to school" value={'$21,970'}/>
          <CalculatorResultRow label="Tuition and fees charged" value={'$38,205'} valueClassName="bold" labelClassName="bold"/>
          <br/>
          <CalculatorResultRow label="Housing allowance" value={'$2,271/mo'}/>
          <CalculatorResultRow label="Book stipend" value={'$1,000'}/>
          <CalculatorResultRow label="Total paid to you" value={'$21,439'} valueClassName="bold" labelClassName="bold"/>
          <hr/>
          <h3>Estimated benefits per term</h3>
          <p>...</p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = {
  showModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(Calculator);
