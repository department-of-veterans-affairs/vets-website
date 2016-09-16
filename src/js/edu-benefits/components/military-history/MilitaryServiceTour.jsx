import React from 'react';

import ErrorableCheckbox from '../../../common/components/form-elements/ErrorableCheckbox';
import ErrorableSelect from '../../../common/components/form-elements/ErrorableSelect';
import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';
import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';
import DateInput from '../../../common/components/form-elements/DateInput';

import { validateIfDirtyDateObj, validateIfDirty, isNotBlank, isValidDateField, isValidDateRange } from '../../utils/validations';
import { serviceBranches, yesNoNA } from '../../utils/options-for-select';

export default class MilitaryServiceTour extends React.Component {
  render() {
    const { view, onValueChange } = this.props;
    const tour = this.props.data;
    const formFields = (
      <div>
        <div className="usa-alert usa-alert-info">
          <ErrorableCheckbox
              className="form-field-alert"
              label="Do not apply this period of service to my selected benefit."
              name="doNotApplyPeriodToSelected"
              checked={tour.doNotApplyPeriodToSelected}
              onValueChange={(update) => {onValueChange('doNotApplyPeriodToSelected', update);}}/>
            {tour.doNotApplyPeriodToSelected
              ? <fieldset>
                <p className="form-checkbox-group-label">Which benefit should this period of service be applied to?</p>
                <ErrorableCheckbox
                    label="Chapter 30"
                    name="applyToChapter30"
                    checked={tour.applyToChapter30}
                    onValueChange={(update) => {onValueChange('applyToChapter30', update);}}/>
                <ErrorableCheckbox
                    label="Chapter 1606"
                    name="applyToChapter1606"
                    checked={tour.applyToChapter1606}
                    onValueChange={(update) => {onValueChange('applyToChapter1606', update);}}/>
                <ErrorableCheckbox
                    label="Chapter 32 / Section 903"
                    name="applyToChapter32"
                    checked={tour.applyToChapter32}
                    onValueChange={(update) => {onValueChange('applyToChapter32', update);}}/>
              </fieldset>
              : null
            }
        </div>
        <ErrorableSelect required
            errorMessage={validateIfDirty(tour.serviceBranch, isNotBlank) ? undefined : 'Please select a service branch'}
            label="Branch of service"
            name="serviceBranch"
            options={serviceBranches}
            value={tour.serviceBranch}
            onValueChange={(update) => {onValueChange('serviceBranch', update);}}/>
        <DateInput required
            errorMessage="Please provide a response"
            validation={validateIfDirtyDateObj(tour.dateRange.from, isValidDateField)}
            label="Date entered"
            name="fromDate"
            day={tour.dateRange.from.day}
            month={tour.dateRange.from.month}
            year={tour.dateRange.from.year}
            onValueChange={(update) => {onValueChange('dateRange.from', update);}}/>
        <DateInput required
            errorMessage={isValidDateRange(tour.dateRange.from, tour.dateRange.to) ? 'Please provide a response' : 'Date separated must be after date entered'}
            validation={validateIfDirtyDateObj(tour.dateRange.to, date => isValidDateRange(tour.dateRange.from, date))}
            label="Date separated"
            name="toDate"
            day={tour.dateRange.to.day}
            month={tour.dateRange.to.month}
            year={tour.dateRange.to.year}
            onValueChange={(update) => {onValueChange('dateRange.to', update);}}/>
        <ErrorableTextInput
            label="Service Status"
            name="serviceStatus"
            field={tour.serviceStatus}
            onValueChange={(update) => {onValueChange('serviceStatus', update);}}/>
        <ErrorableRadioButtons
            label="Were you involuntarily called for active duty during this period?"
            name="involuntarilyCalledToDuty"
            options={yesNoNA}
            value={tour.involuntarilyCalledToDuty}
            onValueChange={(update) => {onValueChange('involuntarilyCalledToDuty', update);}}/>
      </div>
    );

    return view === 'collapsed' ? (<div>{tour.serviceBranch.value}</div>) : formFields;
  }
}

MilitaryServiceTour.propTypes = {
  data: React.PropTypes.object.isRequired,
  view: React.PropTypes.string,
  onValueChange: React.PropTypes.func.isRequired
};
