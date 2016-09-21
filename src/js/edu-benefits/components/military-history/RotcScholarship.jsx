import React from 'react';

import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';

import { isValidYear, validateIfDirty, isNotBlank, isValidMonetaryValue } from '../../utils/validations';

function isValidRequiredAmount(val) {
  return isNotBlank(val) && isValidMonetaryValue(val);
}

function isValidRequiredYear(val) {
  return isNotBlank(val) && isValidYear(val);
}

export default class RotcScholarship extends React.Component {
  render() {
    const { view, onValueChange } = this.props;
    const scholarship = this.props.data;
    const formFields = (
      <div className="row">
        <div className="columns small-4">
          <ErrorableTextInput
              errorMessage={validateIfDirty(scholarship.year, isValidRequiredYear) ? undefined : 'Please enter a valid year.'}
              validation={validateIfDirty(scholarship.year, isValidRequiredYear)}
              label="Year"
              name="year"
              field={scholarship.year}
              placeholder="yyyy"
              required
              onValueChange={(update) => {onValueChange('year', update);}}/>
        </div>
        <div className="columns small-8">
          <ErrorableTextInput
              errorMessage={validateIfDirty(scholarship.amount, isValidRequiredAmount) ? undefined : 'Please enter the amount received.'}
              validation={validateIfDirty(scholarship.amount, isValidRequiredAmount)}
              label="Scholarship amount"
              name="amount"
              field={scholarship.amount}
              placeholder="$"
              required
              onValueChange={(update) => {onValueChange('amount', update);}}/>
        </div>
      </div>
    );

    return view === 'collapsed' ? (<div>{scholarship.amount.value}</div>) : formFields;
  }
}

RotcScholarship.propTypes = {
  data: React.PropTypes.object.isRequired,
  view: React.PropTypes.string,
  onValueChange: React.PropTypes.func.isRequired
};
