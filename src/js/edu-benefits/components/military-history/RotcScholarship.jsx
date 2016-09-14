import React from 'react';

import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';

import { isValidYear, validateIfDirty, isNotBlank } from '../../utils/validations';

export default class RotcScholarship extends React.Component {
  render() {
    const { view, onValueChange } = this.props;
    const scholarship = this.props.data;
    const formFields = (
      <div>
        <ErrorableTextInput
            errorMessage={validateIfDirty(scholarship.amount, isNotBlank) ? undefined : 'Please enter the amount received.'}
            validation={validateIfDirty(scholarship.amount, isNotBlank)}
            label="Amount recieved"
            name="amount"
            field={scholarship.amount}
            placeholder="$"
            required
            onValueChange={(update) => {onValueChange('amount', update);}}/>
        <ErrorableTextInput
            errorMessage={validateIfDirty(scholarship.year, isValidYear) ? undefined : 'Please enter a valid year.'}
            validation={validateIfDirty(scholarship.year, isValidYear)}
            label="Year recieved"
            name="year"
            field={scholarship.year}
            placeholder="yyyy"
            required
            onValueChange={(update) => {onValueChange('year', update);}}/>
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
