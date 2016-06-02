import React from 'react';
import { connect } from 'react-redux';

import ChildIncome from './ChildIncome';
import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import FixedTable from '../form-elements/FixedTable.jsx';
import { isBlank, isValidMonetaryValue } from '../../utils/validations';
import { createChildIncomeFields, updateReviewStatus, veteranUpdateField } from '../../actions';

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class AnnualIncomeSection extends React.Component {
  constructor() {
    super();
    this.isValidMonetaryValue = this.isValidMonetaryValue.bind(this);
  }

  componentWillMount() {
    this.props.initializeChildIncomeFields();
  }

  isValidMonetaryValue(value, message) {
    return isBlank(value) || isValidMonetaryValue(value) ? undefined : message;
  }

  // TODO: Figure out best way to enable users to change their response to pension
  render() {
    const message = 'Please enter only numbers and a decimal point if necessary (no commas or currency signs)';
    let notRequiredMessage;
    let childrenIncomeInput;
    let childrenIncomeReview;
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

    if (this.props.childrenData.hasChildrenToReport === true) {
      childrenIncomeInput = (
        <div className="input-section">
          <FixedTable
              component={ChildIncome}
              onRowsUpdate={(update) => {this.props.onStateChange('children', update);}}
              relatedData={this.props.childrenData.children}
              rows={this.props.data.children}/>
        </div>
      );
    }

    if (this.props.isSectionComplete && this.props.reviewSection) {
      const childrenData = this.props.childrenData.children;
      let reactKey = 0;
      childrenIncomeReview = this.props.data.children.map((obj, index) => {
        return (
          <div key={reactKey++}>
            <h6>Child: {`${childrenData[index].childFullName.first} ${childrenData[index].childFullName.last}`}</h6>
            <table className="review usa-table-borderless">
              <tbody>
                <tr>
                  <td>Children Gross Income:</td>
                  <td>{obj.childGrossIncome}</td>
                </tr>
                <tr>
                  <td>Children Net Income:</td>
                  <td>{obj.childNetIncome}</td>
                </tr>
                <tr>
                  <td>Children Other Income:</td>
                  <td>{obj.childOtherIncome}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      });

      content = (
        <div>
          <h6>Veteran</h6>
          <table className="review usa-table-borderless">
            <tbody>
              <tr>
                <td>Veteran Gross Income:</td>
                <td>{this.props.data.veteranGrossIncome}</td>
              </tr>
              <tr>
                <td>Veteran Net Income:</td>
                <td>{this.props.data.veteranNetIncome}</td>
              </tr>
              <tr>
                <td>Veteran Other Income:</td>
                <td>{this.props.data.veteranOtherIncome}</td>
              </tr>
            </tbody>
          </table>
          <h6>Spouse</h6>
          <table className="review usa-table-borderless">
            <tbody>
              <tr>
                <td>Spouse Gross Income:</td>
                <td>{this.props.data.spouseGrossIncome}</td>
              </tr>
              <tr>
                <td>Spouse Net Income:</td>
                <td>{this.props.data.spouseNetIncome}</td>
              </tr>
              <tr>
                <td>Spouse Other Income:</td>
                <td>{this.props.data.spouseOtherIncome}</td>
              </tr>
            </tbody>
          </table>

          {childrenIncomeReview}

        </div>
      );
    } else {
      content = (<div>
                {notRequiredMessage}

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

      </div>);
    }

    if (this.props.reviewSection) {
      editButton = (<ErrorableCheckbox
          label={`${this.props.isSectionComplete ? 'Edit' : 'Update'}`}
          checked={this.props.isSectionComplete}
          className="edit-checkbox"
          onValueChange={(update) => {this.props.onUIStateChange(update);}}/>
      );
    }

    return (
      <div>
        <h4>Annual Income</h4>
        {editButton}
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.veteran.annualIncome,
    childrenData: state.veteran.childInformation,
    receivesVaPension: state.veteran.vaInformation.receivesVaPension,
    isSectionComplete: state.uiState.completedSections['/financial-assessment/annual-income']
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(['annualIncome', field], update));
    },
    onUIStateChange: (update) => {
      dispatch(updateReviewStatus(['/financial-assessment/annual-income'], update));
    },
    initializeChildIncomeFields: () => {
      dispatch(createChildIncomeFields('/financial-assessment/annual-income'));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(AnnualIncomeSection);
export { AnnualIncomeSection };
