import PropTypes from 'prop-types';
import React from 'react';

import ErrorableTextInput from '../../../../common/components/form-elements/ErrorableTextInput';
import ErrorableRadioButtons from '../../../../common/components/form-elements/ErrorableRadioButtons';
import { validateIfDirty, isValidMonths } from '../../../../common/utils/validations';

import EmploymentPeriodReview from './EmploymentPeriodReview';
import { employmentPeriodTiming } from '../../utils/options-for-select';

export default class EmploymentPeriod extends React.Component {
  render() {
    const { view, onValueChange } = this.props;
    const period = this.props.data;
    const formFields = (
      <div className="input-section">
        <ErrorableRadioButtons
          label="When did you do this work?"
          name="postMilitaryJob"
          options={employmentPeriodTiming}
          value={period.postMilitaryJob}
          onValueChange={(update) => {onValueChange('postMilitaryJob', update);}}/>
        <ErrorableTextInput
          label="Main job"
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

    return view === 'collapsed' ? <EmploymentPeriodReview period={period} onEdit={this.props.onEdit}/> : formFields;
  }
}

EmploymentPeriod.propTypes = {
  data: PropTypes.object.isRequired,
  view: PropTypes.string,
  onValueChange: PropTypes.func.isRequired
};
