import React from 'react';

import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';
import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';

import { isValidMonths, validateIfDirty, isNotBlank } from '../../utils/validations';
import { employmentPeriodTiming } from '../../utils/options-for-select';

export default class EmploymentPeriod extends React.Component {
  render() {
    const { view, onValueChange } = this.props;
    const period = this.props.data;
    const formFields = (
      <div>
        <ErrorableRadioButtons
            label="When was this period of employment?"
            name="postMilitaryJob"
            options={employmentPeriodTiming}
            value={period.postMilitaryJob}
            onValueChange={(update) => {onValueChange('postMilitaryJob', update);}}/>
        <ErrorableTextInput required
            errorMessage={validateIfDirty(period.name, isNotBlank) ? undefined : 'Please provide your occupation'}
            label="Principal occupation"
            name="name"
            field={period.name}
            onValueChange={(update) => {onValueChange('name', update);}}/>
        <ErrorableTextInput
            errorMessage={validateIfDirty(period.months, isValidMonths) ? undefined : 'Please enter a positive number of months'}
            label="Number of months worked"
            validation={validateIfDirty(period.months, isValidMonths)}
            name="months"
            field={period.months}
            onValueChange={(update) => {onValueChange('months', update);}}/>
        <ErrorableTextInput
            label="Licenses or rating"
            name="licenseOrRating"
            field={period.licenseOrRating}
            onValueChange={(update) => {onValueChange('licenseOrRating', update);}}/>
      </div>
    );

    return view === 'collapsed' ? (<div>{period.name.value}</div>) : formFields;
  }
}

EmploymentPeriod.propTypes = {
  data: React.PropTypes.object.isRequired,
  view: React.PropTypes.string,
  onValueChange: React.PropTypes.func.isRequired
};
