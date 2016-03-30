import React from 'react';

import ChildIncome from './ChildIncome';
import FixedTable from '../form-elements/FixedTable.jsx';
import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import { isBlank, isValidMonetaryValue } from '../../utils/validations';

class AnnualIncomeSection extends React.Component {
  constructor() {
    super();
    this.isValidMonetaryValue = this.isValidMonetaryValue.bind(this);
  }

  isValidMonetaryValue(value, message) {
    return isBlank(value) || isValidMonetaryValue(value) ? undefined : message;
  }

  // TODO: Figure out best way to enable users to change their response to pension

  render() {
    const message = 'Please enter only numbers and a decimal point if necessary (no commas or currency signs)';
    let notRequiredMessage;

    if (this.props.external.receivesVaPension === true) {
      notRequiredMessage = (
        <p>
          <strong>
            You are not required to enter financial information because you
            indicated you are receiving a VA pension.
          </strong>
        </p>
      );
    }

    let childrenIncomeInput;

    if (this.props.data.children.length > 0) {
      childrenIncomeInput = (
        <div className="input-section">
          <h6>Children</h6>
          <FixedTable
              component={ChildIncome}
              onRowsUpdate={(update) => {this.props.onStateChange('children', update);}}
              rows={this.props.data.children}/>
        </div>
      );
    }

    return (
      <div>
        <h4>Annual Income</h4>

        {notRequiredMessage}

        <h5>Previous calendar year gross annual income of veteran, spouse and
        dependent children</h5>

        <p><strong>Report</strong> gross annual income from employment, except for income
        from your farm, ranch, property or business, including information
        about your wages, bonuses, tips, severance pay and other accrued
        benefits and your child’s income information if it could have been used
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

        <h6>Definitions</h6>
        <p><strong>Gross annual income</strong>: from employment (wages, bonuses, tips, etc.)
        excluding income from your farm, ranch, property or business</p>
        <p><strong>Net income</strong>: from your farm, ranch, property or business.</p>
        <p><strong>Other income</strong>: possibly from Social Security, compensation, pension,
        interest, and dividends. Exclude welfare.</p>

        <div className="input-section">
          <h6>Veteran</h6>
          <ErrorableTextInput
              errorMessage={this.isValidMonetaryValue(this.props.data.veteranGrossIncome, message)}
              label="Veteran Gross Income"
              value={this.props.data.veteranGrossIncome}
              onValueChange={(update) => {this.props.onStateChange('veteranGrossIncome', update);}}/>

          <ErrorableTextInput
              errorMessage={this.isValidMonetaryValue(this.props.data.veteranNetIncome, message)}
              label="Veteran Net Income"
              value={this.props.data.veteranNetIncome}
              onValueChange={(update) => {this.props.onStateChange('veteranNetIncome', update);}}/>

          <ErrorableTextInput
              errorMessage={this.isValidMonetaryValue(this.props.data.veteranOtherIncome, message)}
              label="Veteran Other Income"
              value={this.props.data.veteranOtherIncome}
              onValueChange={(update) => {this.props.onStateChange('veteranOtherIncome', update);}}/>
        </div>

        <div className="input-section">
          <h6>Spouse</h6>
          <ErrorableTextInput
              errorMessage={this.isValidMonetaryValue(this.props.data.spouseGrossIncome, message)}
              label="Spouse Gross Income"
              value={this.props.data.spouseGrossIncome}
              onValueChange={(update) => {this.props.onStateChange('spouseGrossIncome', update);}}/>

          <ErrorableTextInput
              errorMessage={this.isValidMonetaryValue(this.props.data.spouseNetIncome, message)}
              label="Spouse Net Income"
              value={this.props.data.spouseNetIncome}
              onValueChange={(update) => {this.props.onStateChange('spouseNetIncome', update);}}/>

          <ErrorableTextInput
              errorMessage={this.isValidMonetaryValue(this.props.data.spouseOtherIncome, message)}
              label="Spouse Other Income"
              value={this.props.data.spouseOtherIncome}
              onValueChange={(update) => {this.props.onStateChange('spouseOtherIncome', update);}}/>
        </div>


        {childrenIncomeInput}

      </div>
    );
  }
}

export default AnnualIncomeSection;
