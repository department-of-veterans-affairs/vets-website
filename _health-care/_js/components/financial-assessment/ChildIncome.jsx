import React from 'react';

import ErrorableTextInput from '../form-elements/ErrorableTextInput';

import { isBlank, isValidMonetaryValue } from '../../utils/validations';

/**
 * Sub-component for children income portion AnnualIncomeSection.
 *
 * Props:
 * `data` - Collection of numbers for each field.
 * `onValueChange` - a function with this prototype: (newValue)
 */
class ChildIncome extends React.Component {
  render() {
    const message = 'Please enter only numbers and a decimal point if necessary (no commas or currency signs)';

    return (
      <div>
        <h6>{this.props.data.childShortName}</h6>
        <ErrorableTextInput
            errorMessage={isBlank(this.props.data.childGrossIncome) || isValidMonetaryValue(this.props.data.childGrossIncome) ? undefined : message}
            label="Gross Income"
            value={this.props.data.childGrossIncome}
            onValueChange={(update) => {this.props.onValueChange('childGrossIncome', update);}}/>
        <ErrorableTextInput
            errorMessage={isBlank(this.props.data.childNetIncome) || isValidMonetaryValue(this.props.data.childNetIncome) ? undefined : message}
            label="Net Income"
            value={this.props.data.childNetIncome}
            onValueChange={(update) => {this.props.onValueChange('childNetIncome', update);}}/>
        <ErrorableTextInput
            errorMessage={isBlank(this.props.data.childOtherIncome) || isValidMonetaryValue(this.props.data.childOtherIncome) ? undefined : message}
            label="Other Income"
            value={this.props.data.childOtherIncome}
            onValueChange={(update) => {this.props.onValueChange('childOtherIncome', update);}}/>
      </div>
    );
  }
}

ChildIncome.propTypes = {
  data: React.PropTypes.object.isRequired,
  onValueChange: React.PropTypes.func.isRequired
};

export default ChildIncome;
