import React from 'react';

import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';

import { getMonetaryErrorMessage } from '../../utils/messages';

/**
 * Sub-component for children income portion AnnualIncomeSection.
 *
 * Props:
 * `data` - Collection of numbers for each field.
 * `onValueChange` - a function with this prototype: (newValue)
 */
class ChildIncome extends React.Component {
  render() {
    const message = getMonetaryErrorMessage;

    return (
      <div>
        <h6>Child: {`${this.props.data.childFullName.first.value} ${this.props.data.childFullName.last.value}`}</h6>
        <ErrorableTextInput required
            errorMessage={message(this.props.data.grossIncome)}
            label="Child Gross Annual Income from Employment"
            name="childGrossIncome"
            field={this.props.data.grossIncome}
            onValueChange={(update) => {this.props.onValueChange('grossIncome', update);}}/>
        <ErrorableTextInput required
            errorMessage={message(this.props.data.netIncome)}
            label="Child Net Income from your Farm, Ranch, Property or Business"
            name="childNetIncome"
            field={this.props.data.netIncome}
            onValueChange={(update) => {this.props.onValueChange('netIncome', update);}}/>
        <ErrorableTextInput required
            errorMessage={message(this.props.data.otherIncome)}
            label="Child Other Income Amount"
            name="childOtherIncome"
            field={this.props.data.otherIncome}
            onValueChange={(update) => {this.props.onValueChange('otherIncome', update);}}/>
      </div>
    );
  }
}

ChildIncome.propTypes = {
  data: React.PropTypes.object.isRequired,
  onValueChange: React.PropTypes.func.isRequired
};

export default ChildIncome;
