import PropTypes from 'prop-types';
import React from 'react';

import ErrorableCheckbox from '../../../../common/components/form-elements/ErrorableCheckbox';
import ErrorableTextInput from '../../../../common/components/form-elements/ErrorableTextInput';
import ErrorableTextarea from '../../../../common/components/form-elements/ErrorableTextarea';
import ErrorableDate from '../../../../common/components/form-elements/ErrorableDate';
import ErrorableCurrentOrPastDate from '../../../../common/components/form-elements/ErrorableCurrentOrPastDate';
import ExpandingGroup from '../../../../common/components/form-elements/ExpandingGroup';
import { validateIfDirty, isNotBlank, isValidDateRange } from '../../../../common/utils/validations';

import ServicePeriodsReview from './ServicePeriodsReview';

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
              label="Branch of service:"
              name="serviceBranch"
              field={tour.serviceBranch}
              onValueChange={(update) => {onValueChange('serviceBranch', update);}}/>
          </div>
          <ErrorableTextInput
            label="Type of service (Active duty, drilling reservist, IRR, etc.)"
            name="serviceStatus"
            field={tour.serviceStatus}
            onValueChange={(update) => {onValueChange('serviceStatus', update);}}/>
          <ErrorableCurrentOrPastDate required
            label="Start of service period:"
            name="fromDate"
            date={tour.dateRange.from}
            onValueChange={(update) => {onValueChange('dateRange.from', update);}}/>
          <ErrorableDate
            validation={{
              valid: isValidDateRange(tour.dateRange.from, tour.dateRange.to),
              message: 'End of service must be after start of service'
            }}
            label="End of service period:"
            name="toDate"
            date={tour.dateRange.to}
            onValueChange={(update) => {onValueChange('dateRange.to', update);}}/>
        </div>
        <div className="input-section">
          <ExpandingGroup
            open={!tour.applyPeriodToSelected}
            additionalClass="edu-benefits-apply-group">
            <ErrorableCheckbox
              className="form-field-alert"
              label="Apply this service period to the benefit I’m applying for."
              name="applyPeriodToSelected"
              checked={tour.applyPeriodToSelected}
              onValueChange={(update) => {onValueChange('applyPeriodToSelected', update);}}/>
            <div>
              <ErrorableTextarea
                label="Please explain how you’d like this service period applied."
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

    return view === 'collapsed'
      ? <ServicePeriodsReview tour={tour} onEdit={this.props.onEdit}/>
      : formFields;
  }
}

MilitaryServiceTour.propTypes = {
  data: PropTypes.object.isRequired,
  view: PropTypes.string,
  onValueChange: PropTypes.func.isRequired
};
