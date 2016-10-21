import React from 'react';

import ErrorableCheckbox from '../../../common/components/form-elements/ErrorableCheckbox';
import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';
import ErrorableTextarea from '../../../common/components/form-elements/ErrorableTextarea';
import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';
import ExpandingGroup from '../../../common/components/form-elements/ExpandingGroup';
import DateInput from '../../../common/components/form-elements/DateInput';

import { validateIfDirtyDateObj, validateIfDirty, isNotBlank, isValidDateField, isValidDateRange } from '../../utils/validations';
import { yesNo } from '../../utils/options-for-select';
import { displayDateIfValid } from '../../utils/helpers';

export default class MilitaryServiceTour extends React.Component {
  render() {
    const { view, onValueChange } = this.props;
    const tour = this.props.data;
    const formFields = (
      <div>
        <div className="input-section">
          <div className="edu-benefits-first-label">
            <ErrorableTextInput required
                errorMessage={validateIfDirty(tour.serviceBranch, isNotBlank) ? undefined : 'Please select a service branch'}
                label="Branch of service"
                name="serviceBranch"
                field={tour.serviceBranch}
                onValueChange={(update) => {onValueChange('serviceBranch', update);}}/>
          </div>
          <ErrorableTextInput
              label="Type of service (Active duty, drilling reservist, IRR, etc.)"
              name="serviceStatus"
              field={tour.serviceStatus}
              onValueChange={(update) => {onValueChange('serviceStatus', update);}}/>
          <DateInput required
              errorMessage="Please provide a valid date"
              validation={validateIfDirtyDateObj(tour.dateRange.from, isValidDateField)}
              label="Date entered"
              name="fromDate"
              day={tour.dateRange.from.day}
              month={tour.dateRange.from.month}
              year={tour.dateRange.from.year}
              onValueChange={(update) => {onValueChange('dateRange.from', update);}}/>
          <DateInput required
              errorMessage={isValidDateRange(tour.dateRange.from, tour.dateRange.to) ? 'Please provide a valid date' : 'Date separated must be after date entered'}
              validation={validateIfDirtyDateObj(tour.dateRange.to, date => isValidDateRange(tour.dateRange.from, date))}
              label="Date separated"
              name="toDate"
              day={tour.dateRange.to.day}
              month={tour.dateRange.to.month}
              year={tour.dateRange.to.year}
              onValueChange={(update) => {onValueChange('dateRange.to', update);}}/>
          <ErrorableRadioButtons
              label="Were you involuntarily called for active duty during this period?"
              name="involuntarilyCalledToDuty"
              options={yesNo}
              value={tour.involuntarilyCalledToDuty}
              onValueChange={(update) => {onValueChange('involuntarilyCalledToDuty', update);}}/>
        </div>
        <div className="input-section">
          <ExpandingGroup
              open={!tour.applyPeriodToSelected}
              additionalClass="edu-benefits-apply-group">
            <ErrorableCheckbox
                className="form-field-alert"
                label="Apply this service period to the benefit I'm applying for."
                name="applyPeriodToSelected"
                checked={tour.applyPeriodToSelected}
                onValueChange={(update) => {onValueChange('applyPeriodToSelected', update);}}/>
            <div>
              <ErrorableTextarea
                  label="Please tell us which benefit you’d like this service applied to."
                  name="benefitsToApplyTo"
                  field={tour.benefitsToApplyTo}
                  onValueChange={(update) => {onValueChange('benefitsToApplyTo', update);}}/>
              <p>A single period of service may not be applied toward more than one benefit.</p>
              <p>There is one exception: If your period of service began before August 1, 2011, you may use it to establish eligibility to Chapter 33 even if it has already been used to establish eligibility to a different benefit.</p>
            </div>
          </ExpandingGroup>
        </div>
      </div>
    );

    return view === 'collapsed' ? (<div><strong>{tour.serviceBranch.value}</strong><br/>{displayDateIfValid(tour.dateRange.from)} &mdash; {displayDateIfValid(tour.dateRange.to)}</div>) : formFields;
  }
}

MilitaryServiceTour.propTypes = {
  data: React.PropTypes.object.isRequired,
  view: React.PropTypes.string,
  onValueChange: React.PropTypes.func.isRequired
};
