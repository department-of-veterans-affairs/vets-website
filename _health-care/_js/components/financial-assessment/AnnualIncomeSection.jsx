import React from 'react';

import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import { isBlank, isValidMonetaryValue } from '../../utils/validations';

class AnnualIncomeSection extends React.Component {
  constructor() {
    super();
    this.validateMonetaryFields = this.validateMonetaryFields.bind(this);
  }

  validateMonetaryFields(value, message) {
    return isBlank(value) || isValidMonetaryValue(value) ? undefined : message;
  }

  render() {
    const message = 'Please enter only numbers and a decimal point if necessary (no commas or currency signs)';

    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <h4>Annual Income</h4>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <h5>Previous calendar year gross annual income of veteran, spouse and
            dependent children</h5>
            <p><strong>Report</strong> gross annual income from employment, except for income
            from your farm, ranch, property or business, including information
            about your wages, bonuses, tips, severance pay and other accrued
            benefits and your child's income information if it could have been used
            to pay your household expenses.
            </p>

            <p><strong>Report</strong> net income from your farm, ranch, property or business.
            Payments on principal of mortgage and depreciation expenses are not
            deductible.
            </p>

            <p><strong>Report</strong> other income amounts, including retirement and pension
            income, Social Security Retirement and Social Security Disability
            income, compensation benefits such as VA disability, unemployment,
            Workers and black lung; cash gifts, interest and dividends, including
            tax exempt earnings and distributions from Individual Retirement
            Accounts (IRAs) or annuities.
            </p>

            <p><strong>Do Not Report:</strong> Donations from public or private relief,
            welfare or charitable organizations; Supplemental Security Income (SSI)
            and need-based payments from a government agency; profit from the
            occasional sale of property; income tax refunds; reinvested interest on
            Individual Retirement Accounts (IRAs); scholarship and grants for school
            attendance; disaster relief payment; reimbursement for casualty loss;
            loans; Radiation Compensation Exposure Act payments; Agent Orange
            settlement payments; and Alaska Native Claim Settlement Acts Income;
            payments to foster parents; amounts in joint accounts in banks and
            similar institutions acquired by reason of death or other joint owner;
            Japanese ancestry restitution under Public Law 100-383; cash surrender
            value of life insurance; lump-sum proceeds of life insurance policy on a
            Veteran; and payments received under the Medicare transitional
            assistance program.
            </p>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <h6>Definitions</h6>
            <p><strong>Gross annual income</strong>: from employment (wages, bonuses, tips, etc.)
            excluding income from your farm, ranch, property or business</p>
            <p><strong>Net income</strong>: from your farm, ranch, property or business.</p>
            <p><strong>Other income</strong>: possibly from Social Security, compensation, pension,
            interest, and dividends. Exclude welfare.</p>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <h6>Veteran</h6>
            <ErrorableTextInput
                errorMessage={this.validateMonetaryFields(this.props.data.veteranGrossIncome, message)}
                label="Veteran Gross Income"
                value={this.props.data.veteranGrossIncome}
                onValueChange={(update) => {this.props.onStateChange('veteranGrossIncome', update);}}/>

            <ErrorableTextInput
                errorMessage={this.validateMonetaryFields(this.props.data.veteranNetIncome, message)}
                label="Veteran Net Income"
                value={this.props.data.veteranNetIncome}
                onValueChange={(update) => {this.props.onStateChange('veteranNetIncome', update);}}/>

            <ErrorableTextInput
                errorMessage={this.validateMonetaryFields(this.props.data.veteranOtherIncome, message)}
                label="Veteran Other Income"
                value={this.props.data.veteranOtherIncome}
                onValueChange={(update) => {this.props.onStateChange('veteranOtherIncome', update);}}/>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <h6>Spouse</h6>
            <ErrorableTextInput
                errorMessage={this.validateMonetaryFields(this.props.data.spouseGrossIncome, message)}
                label="Spouse Gross Income"
                value={this.props.data.spouseGrossIncome}
                onValueChange={(update) => {this.props.onStateChange('spouseGrossIncome', update);}}/>

            <ErrorableTextInput
                errorMessage={this.validateMonetaryFields(this.props.data.spouseNetIncome, message)}
                label="Spouse Net Income"
                value={this.props.data.spouseNetIncome}
                onValueChange={(update) => {this.props.onStateChange('spouseNetIncome', update);}}/>

            <ErrorableTextInput
                errorMessage={this.validateMonetaryFields(this.props.data.spouseOtherIncome, message)}
                label="Spouse Other Income"
                value={this.props.data.spouseOtherIncome}
                onValueChange={(update) => {this.props.onStateChange('spouseOtherIncome', update);}}/>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <h6>Children</h6>
            <ErrorableTextInput
                errorMessage={this.validateMonetaryFields(this.props.data.childrenGrossIncome, message)}
                label="Children Gross Income"
                value={this.props.data.childrenGrossIncome}
                onValueChange={(update) => {this.props.onStateChange('childrenGrossIncome', update);}}/>

            <ErrorableTextInput
                errorMessage={this.validateMonetaryFields(this.props.data.childrenNetIncome, message)}
                label="Children Net Income"
                value={this.props.data.childrenNetIncome}
                onValueChange={(update) => {this.props.onStateChange('childrenNetIncome', update);}}/>

            <ErrorableTextInput
                errorMessage={this.validateMonetaryFields(this.props.data.childrenOtherIncome, message)}
                label="Children Other Income"
                value={this.props.data.childrenOtherIncome}
                onValueChange={(update) => {this.props.onStateChange('childrenOtherIncome', update);}}/>
          </div>
        </div>
      </div>
    );
  }
}

export default AnnualIncomeSection;
