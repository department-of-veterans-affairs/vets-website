import React from 'react';
import { connect } from 'react-redux';

import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import { isBlank, isValidMonetaryValue } from '../../utils/validations';
import { veteranUpdateField } from '../../actions';

/**
 * Props:
 * `sectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
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
    let notRequiredMessage;
    let content;
    let editButton;

    if (this.props.receivesVaPension === true) {
      notRequiredMessage = (
        <p>
          <strong>
            You are not required to enter financial information because you
            indicated you are receiving a VA pension.
          </strong>
        </p>
      );
    }

    if (this.props.data.sectionComplete) {
      content = (<table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Total non-reimbursed medical expenses paid by you or your spouse:</td>
            <td>{this.props.data.deductibleMedicalExpenses}</td>
          </tr>
          <tr>
            <td>Amount you paid last calendar year for funeral and burial expenses
         for your deceased spouse or dependent child:
            </td>
            <td>{this.props.data.deductibleFuneralExpenses}</td>
          </tr>
          <tr>
            <td>Amount you paid last calendar year for your college or vocational
              educational expenses:
            </td>
            <td>{this.props.data.deductibleEducationExpenses}</td>
          </tr>
        </tbody>
      </table>);
    } else {
      content = (<div>
        {notRequiredMessage}

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

        <div>
          <ErrorableTextInput
              errorMessage={this.isValidMonetaryValue(this.props.data.deductibleMedicalExpenses, message)}
              label="Total non-reimbursed medical expenses paid by you or your spouse
                  (e.g., payments for doctors, dentists, medications, Medicare, health
                  insurance, hospital and nursing home) VA will calculate a deductible
                  and the net medical expenses you may claim."
              value={this.props.data.deductibleMedicalExpenses}
              onValueChange={(update) => {this.props.onStateChange('deductibleMedicalExpenses', update);}}/>

          <ErrorableTextInput
              errorMessage={this.isValidMonetaryValue(this.props.data.deductibleFuneralExpenses, message)}
              label="Amount you paid last calendar year for funeral and burial expenses
                  for your deceased spouse or dependent child (Also enter spouse or child’s
                  information in Spouse Information and Children Information)"
              value={this.props.data.deductibleFuneralExpenses}
              onValueChange={(update) => {this.props.onStateChange('deductibleFuneralExpenses', update);}}/>

          <ErrorableTextInput
              errorMessage={this.isValidMonetaryValue(this.props.data.deductibleEducationExpenses, message)}
              label="Amount you paid last calendar year for your college or vocational
              educational expenses (e.g., tuition, books, fees, materials) Do not list
              your dependents’ educational expenses."
              value={this.props.data.deductibleEducationExpenses}
              onValueChange={(update) => {this.props.onStateChange('deductibleEducationExpenses', update);}}/>
        </div>
      </div>);
    }

    if (this.props.reviewSection) {
      editButton = (<ErrorableCheckbox
          label={`${this.props.data.sectionComplete ? 'Edit' : 'Update'}`}
          checked={this.props.data.sectionComplete}
          className="edit-checkbox"
          onValueChange={(update) => {this.props.onStateChange('sectionComplete', update);}}/>
      );
    }

    return (
      <div>
        <h4>Previous calendar year deductible expenses</h4>
        {editButton}
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.deductibleExpenses,
    receivesVaPension: state.vaInformation.receivesVaPension,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(['deductibleExpenses', field], update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(DeductibleExpensesSection);
export { DeductibleExpensesSection };
