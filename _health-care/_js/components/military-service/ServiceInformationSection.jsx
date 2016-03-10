import React from 'react';

import ErrorableSelect from '../form-elements/ErrorableSelect';
import DateInput from '../form-elements/DateInput';

import { branchesServed, dischargeTypes } from '../../utils/options-for-select.js';

class ServiceInformationSection extends React.Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <h4>Service Information</h4>

              <ErrorableSelect label="Last branch of service"
                  options={branchesServed}
                  value={this.props.data.lastServiceBranch}
                  onUserInput={(update) => {this.props.onStateChange('lastServiceBranch', update);}}/>
            </div>
            <div className="small-12 columns">
              <p>Last entry date</p>
              <DateInput
                  day={this.props.data.lastEntryDate.day}
                  month={this.props.data.lastEntryDate.month}
                  year={this.props.data.lastEntryDate.year}
                  onValueChange={(update) => {this.props.onStateChange('lastEntryDate', update);}}/>
            </div>
            <div className="small-12 columns">
              <p>Last discharge date</p>
              <DateInput
                  day={this.props.data.lastDischargeDate.day}
                  month={this.props.data.lastDischargeDate.month}
                  year={this.props.data.lastDischargeDate.year}
                  onValueChange={(update) => {this.props.onStateChange('lastDischargeDate', update);}}/>
            </div>
            <div className="small-12 columns">
            <ErrorableSelect label="Discharge Type"
                options={dischargeTypes}
                value={this.props.data.dischargeType}
                onUserInput={(update) => {this.props.onStateChange('dischargeType', update);}}/>
            </div>
        </div>
      </div>
    );
  }
}

export default ServiceInformationSection;
