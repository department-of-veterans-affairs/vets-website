import React from 'react';

import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import { isBlank, isValidMonetaryValue } from '../../utils/validations';

class DeductibleExpensesSection extends React.Component {
  constructor() {
    super();
    this.isValidMonetaryValue = this.isValidMonetaryValue.bind(this);
  }

  isValidMonetaryValue(value, message) {
    return isBlank(value) || isValidMonetaryValue(value) ? undefined : message;
  }

  render() {
    const message = 'Please enter only numbers and a decimal point if necessary (no commas or currency signs)';

    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <h4>Deductible Expenses</h4>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <h4>Previous calendar year deductible expenses</h4>
            <p>
              Report non-reimbursed medical expenses paid by you or your spouse.
              Include expenses for medical and dental care, drugs, eyeglasses,
              Medicare, medical insurance premiums and other health care expenses
              paid by you for dependents and persons for whom you have a legal or
              moral obligation to support. Do not list expenses if you expect to
              receive reimbursement from insurance or other sources. Report expenses
              of last illness and burial expenses, e.g., prepaid burial, paid by the
              Veteran for spouse or dependent(s).
            </p>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <ErrorableTextInput
                errorMessage={this.isValidMonetaryValue(this.props.data.deductibleMedicalExpenses, message)}
                label="Total non-reimbursed medical expenses paid by you or your spouse
                    (e.g., payments for doctors, dentists, medications, Medicare, health
                    insurance, hospital and nursing home) VA will calculate a deductible
                    and the net medical expenses you may claim."
                value={this.props.data.deductibleMedicalExpenses}
                onValueChange={(update) => {this.props.onStateChange('deductibleMedicalExpenses', update);}}/>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <ErrorableTextInput
                errorMessage={this.isValidMonetaryValue(this.props.data.deductibleFuneralExpenses, message)}
                label="Amount you paid last calendar year for funeral and burial expenses
                    for your deceased spouse or dependent child (Also enter spouse or child’s
                    information in Spouse Information and Children Information)"
                value={this.props.data.deductibleFuneralExpenses}
                onValueChange={(update) => {this.props.onStateChange('deductibleFuneralExpenses', update);}}/>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <ErrorableTextInput
                errorMessage={this.isValidMonetaryValue(this.props.data.deductibleEducationExpenses, message)}
                label="Amount you paid last calendar year for your college or vocational
                educational expenses (e.g., tuition, books, fees, materials) Do not list
                your dependents’ educational expenses."
                value={this.props.data.deductibleEducationExpenses}
                onValueChange={(update) => {this.props.onStateChange('deductibleEducationExpenses', update);}}/>
          </div>
        </div>
      </div>
    );
  }
}

export default DeductibleExpensesSection;
