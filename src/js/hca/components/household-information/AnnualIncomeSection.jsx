import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import ChildIncome from './ChildIncome';
import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import FixedTable from '../form-elements/FixedTable.jsx';
import { isValidField, isValidMonetaryValue } from '../../utils/validations';
import { veteranUpdateField } from '../../actions';

function getErrorMessage(field, message) {
  return isValidField(isValidMonetaryValue, field) ? undefined : message;
}

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class AnnualIncomeSection extends React.Component {

  hasIncome(data) {
    const income = [
      data.veteranGrossIncome,
      data.veteranNetIncome,
      data.veteranOtherIncome
    ];
    const incomeValues = _.some(income, 'value');
    return incomeValues || data.hasChildrenToReport.value === 'Y' ||
      data.maritalStatus.value === 'Married' || data.maritalStatus.value === 'Separated';
  }

  veteranIncomeTable(data) {
    let veteranTable;
    if (this.hasIncome(data)) {
      veteranTable = (<tbody>
        <tr>
          <td>Veteran Gross Annual Income from Employment :</td>
          <td>{data.veteranGrossIncome.value}</td>
        </tr>
        <tr>
          <td>Veteran Net Income from your Farm, Ranch, Property or Business :</td>
          <td>{data.veteranNetIncome.value}</td>
        </tr>
        <tr>
          <td>Veteran Other Income Amount:</td>
          <td>{data.veteranOtherIncome.value}</td>
        </tr>
      </tbody>);
    } else {
      veteranTable = (<tbody>
        <tr>
          <td>No income information was entered</td>
        </tr>
      </tbody>);
    }
    return veteranTable;
  }

  // TODO: Figure out best way to enable users to change their response to pension
  render() {
    const message = 'Please enter only numbers and a decimal point if necessary (no commas or currency signs)';
    let childrenIncomeInput;
    let childrenIncomeReview;
    let spouseIncomeInput;
    let spouseIncomeReview;
    let content;

    if (this.props.data.hasChildrenToReport.value === 'Y') {
      childrenIncomeInput = (
        <div className="input-section">
          <FixedTable
              component={ChildIncome}
              onRowsUpdate={(update) => {this.props.onStateChange('children', update);}}
              rows={this.props.data.children}/>
        </div>
      );

      childrenIncomeReview = this.props.data.children.map((child, index) => {
        return (
          <div key={`child-${index}`}>
            <h6>Child: {`${child.childFullName.first.value} ${child.childFullName.last.value}`}</h6>
            <table className="review usa-table-borderless">
              <tbody>
                <tr>
                  <td>Child Gross Annual Income from Employment:</td>
                  <td>{child.grossIncome.value}</td>
                </tr>
                <tr>
                  <td>Child Net Income from your Farm, Ranch, Property or Business:</td>
                  <td>{child.netIncome.value}</td>
                </tr>
                <tr>
                  <td>Child Other Income Amount:</td>
                  <td>{child.otherIncome.value}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      });
    }

    if (this.props.data.maritalStatus.value === 'Married' || this.props.data.maritalStatus.value === 'Separated') {
      spouseIncomeInput = (
        <div className="input-section">
          <h6>Spouse</h6>
          <ErrorableTextInput
              errorMessage={getErrorMessage(this.props.data.spouseGrossIncome, message)}
              label="Spouse Gross Annual Income from Employment"
              name="spouseGrossIncome"
              field={this.props.data.spouseGrossIncome}
              onValueChange={(update) => {this.props.onStateChange('spouseGrossIncome', update);}}/>

          <ErrorableTextInput
              errorMessage={getErrorMessage(this.props.data.spouseNetIncome, message)}
              label="Spouse Net Income from your Farm, Ranch, Property or Business"
              name="spouseNetIncome"
              field={this.props.data.spouseNetIncome}
              onValueChange={(update) => {this.props.onStateChange('spouseNetIncome', update);}}/>

          <ErrorableTextInput
              errorMessage={getErrorMessage(this.props.data.spouseOtherIncome, message)}
              label="Spouse Other Income Amount"
              name="spouseOtherIncome"
              field={this.props.data.spouseOtherIncome}
              onValueChange={(update) => {this.props.onStateChange('spouseOtherIncome', update);}}/>
        </div>
      );

      spouseIncomeReview = (
        <div>
          <h6>Spouse</h6>
          <table className="review usa-table-borderless">
            <tbody>
              <tr>
                <td>Spouse Gross Annual Income from Employment :</td>
                <td>{this.props.data.spouseGrossIncome.value}</td>
              </tr>
              <tr>
                <td>Spouse Net Income from your Farm, Ranch, Property or Business :</td>
                <td>{this.props.data.spouseNetIncome.value}</td>
              </tr>
              <tr>
                <td>Spouse Other Income Amount:</td>
                <td>{this.props.data.spouseOtherIncome.value}</td>
              </tr>
            </tbody>
          </table>
        </div>);
    }

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (
        <div>
          <h6>Veteran</h6>
          <table className="review usa-table-borderless">
            {this.veteranIncomeTable(this.props.data)}
          </table>

          {spouseIncomeReview}

          {childrenIncomeReview}

        </div>
      );
    } else {
      content = (<fieldset>
        <legend>Annual Income</legend>

        <div>

          <h5></h5>

          <p>
          Please fill this out to the best of your knowledge. Provide the previous calendar year’s gross annual income for you, your spouse, and your dependent children.
          </p>

          <p><strong>Gross annual income:</strong> This is from employment only, and does not include income from your farm, ranch, property, or business. When you calculate your gross annual income, include your wages, bonuses, tips, severance pay, and other accrued benefits. Include your child's income information if it could have been used to pay your household expenses.</p>
          <p><strong>Net income:</strong> This is the income from your farm, ranch, property, or business.</p>
          <p><strong>Other income: </strong> This includes retirement and pension income; Social Security Retirement and Social Security Disability income; compensation benefits such as VA disability, unemployment, Workers, and black lung; cash gifts; interest and dividends, including tax exempt earnings and distributions from Individual Retirement Accounts (IRAs) or annuities.</p>

          <div className="input-section">
            <h6>Veteran</h6>
            <ErrorableTextInput
                errorMessage={getErrorMessage(this.props.data.veteranGrossIncome, message)}
                label="Veteran gross annual income from employment"
                name="veteranGrossIncome"
                field={this.props.data.veteranGrossIncome}
                onValueChange={(update) => {this.props.onStateChange('veteranGrossIncome', update);}}/>

            <ErrorableTextInput
                errorMessage={getErrorMessage(this.props.data.veteranNetIncome, message)}
                label="Veteran Net Income from your Farm, Ranch, Property or Business"
                name="veteranNetIncome"
                field={this.props.data.veteranNetIncome}
                onValueChange={(update) => {this.props.onStateChange('veteranNetIncome', update);}}/>

            <ErrorableTextInput
                errorMessage={getErrorMessage(this.props.data.veteranOtherIncome, message)}
                label="Veteran Other Income Amount"
                name="veteranOtherIncome"
                field={this.props.data.veteranOtherIncome}
                onValueChange={(update) => {this.props.onStateChange('veteranOtherIncome', update);}}/>
          </div>

          {spouseIncomeInput}

          {childrenIncomeInput}

        </div>
      </fieldset>);
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.veteran,
    isSectionComplete: state.uiState.sections['/household-information/annual-income'].complete
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(field, update));
    },
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(AnnualIncomeSection);
export { AnnualIncomeSection };
