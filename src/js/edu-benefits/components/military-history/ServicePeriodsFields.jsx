import React from 'react';

import GrowableTable from '../../../common/components/form-elements/GrowableTable';

import MilitaryServiceTour from './MilitaryServiceTour';
import { createTour } from '../../utils/veteran';

import { isValidPage, isValidTourOfDuty } from '../../utils/validations';

export default class ServicePeriodsFields extends React.Component {
  render() {
    const tourFields = [
      'applyPeriodToSelected',
      'benefitsToApplyTo',
      'serviceBranch',
      'dateRange',
      'serviceStatus',
    ];

    return (<fieldset>
      <legend>Service periods</legend>
      <p><span className="form-required-span">*</span>Indicates a required field</p>
      <div className="input-section">
        <p>Please record all your periods of service.</p>
        <div className="input-section">
          <GrowableTable
              component={MilitaryServiceTour}
              createRow={createTour}
              data={this.props.data}
              initializeCurrentElement={() => this.props.initializeFields(tourFields, 'toursOfDuty')}
              onRowsUpdate={(update) => {this.props.onStateChange('toursOfDuty', update);}}
              path="/military-history/service-periods"
              rows={this.props.data.toursOfDuty}
              isValidSection={isValidPage}
              addNewMessage="Add Another Service Period"
              minimumRows={1}
              rowTitle="New service period"
              isValidRow={isValidTourOfDuty}/>
        </div>
      </div>
    </fieldset>
    );
  }
}

ServicePeriodsFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired,
  initializeFields: React.PropTypes.func.isRequired
};
