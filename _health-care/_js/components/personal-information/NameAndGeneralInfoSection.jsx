import React from 'react';

import DateInput from '../form-elements/DateInput';
import ErrorableSelect from '../form-elements/ErrorableSelect';
import FullName from './FullName';
import Gender from './Gender';
import MothersMaidenName from './MothersMaidenName';
import SocialSecurityNumber from './SocialSecurityNumber';
import State from './State';

import { maritalStatuses } from '../../utils/options-for-select.js';

class NameAndGeneralInfoSection extends React.Component {
  render() {
    return (
      <div className="tabs-content">
        <div className="row">
          <div className="small-12 columns">
            <h3>Name and General Information</h3>
          </div>
        </div>
        <fieldset className="usa-fieldset-inputs usa-sans">
          <div className="row">
            <div className="small-12 columns">
              <h4>Veteran's Name</h4>
              <FullName name={this.props.data.fullName}
                  onUserInput={(update) => {this.props.onStateChange('fullName', update);}}/>
              <MothersMaidenName name={this.props.data.mothersMaidenName}
                  onUserInput={(update) => {this.props.onStateChange('mothersMaidenName', update);}}/>
              <SocialSecurityNumber ssn={this.props.data.socialSecurityNumber}
                  onValueChange={(update) => {this.props.onStateChange('socialSecurityNumber', update);}}/>
              <Gender value={this.props.data.gender} onUserInput={(update) => {this.props.onStateChange('gender', update);}}/>
            </div>
            <div className="small-12 columns">
              <h4>Date of Birth</h4>
              <span className="usa-form-hint usa-datefield-hint" id="dobHint">For example: 04 28 1986</span>
              <DateInput
                  day={this.props.data.dateOfBirth.day}
                  month={this.props.data.dateOfBirth.month}
                  year={this.props.data.dateOfBirth.year}
                  onValueChange={(update) => {this.props.onStateChange('dateOfBirth', update);}}/>
            </div>
          </div>

          <div className="usa-input-grid usa-input-grid-large">
            <h4>Place of Birth</h4>
            <div>
              <div className="usa-input-grid usa-input-grid-medium">
                <label htmlFor="veteran_city_of_birth">City</label>
                <input type="text" name="veteran[city_of_birth]"/>
              </div>
              <State value={this.props.data.state} onUserInput={(update) => {this.props.onStateChange('state', update);}}/>
            </div>
          </div>
          <div className="sa-input-grid usa-input-grid-large">
            <ErrorableSelect label="Current Marital Status"
                options={maritalStatuses}
                value={this.props.data.maritalStatus}
                onUserInput={(update) => {this.props.onStateChange('maritalStatus', update);}}/>
          </div>
        </fieldset>
      </div>
    );
  }
}

export default NameAndGeneralInfoSection;
