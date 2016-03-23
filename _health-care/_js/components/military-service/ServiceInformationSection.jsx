import React from 'react';

import ErrorableSelect from '../form-elements/ErrorableSelect';
import DateInput from '../form-elements/DateInput';

import { branchesServed, dischargeTypes } from '../../utils/options-for-select.js';

class ServiceInformationSection extends React.Component {
  render() {
    return (
      <div>
        <h4>Service Information</h4>

        <div className="input-section">
          <ErrorableSelect
              label="Last branch of service"
              options={branchesServed}
              value={this.props.data.lastServiceBranch}
              onUserInput={(update) => {this.props.onStateChange('lastServiceBranch', update);}}/>

          <DateInput label="Last entry date"
              day={this.props.data.lastEntryDate.day}
              month={this.props.data.lastEntryDate.month}
              year={this.props.data.lastEntryDate.year}
              onValueChange={(update) => {this.props.onStateChange('lastEntryDate', update);}}/>

          <DateInput label="Last discharge date"
              day={this.props.data.lastDischargeDate.day}
              month={this.props.data.lastDischargeDate.month}
              year={this.props.data.lastDischargeDate.year}
              onValueChange={(update) => {this.props.onStateChange('lastDischargeDate', update);}}/>

          <ErrorableSelect
              label="Discharge Type"
              options={dischargeTypes}
              value={this.props.data.dischargeType}
              onUserInput={(update) => {this.props.onStateChange('dischargeType', update);}}/>
        </div>
      </div>
    );
  }
}

export default ServiceInformationSection;
