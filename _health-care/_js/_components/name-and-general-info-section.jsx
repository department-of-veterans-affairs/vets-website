import React from 'react';

import DateInput from './date-input';
import FullName from './full-name';
import MothersMaidenName from './mothers-maiden-name';
import SocialSecurityNumber from './social-security-number';
import GenderInput from './gender';
import AddressState from './address-state';

class NameAndGeneralInfoSection extends React.Component {
  render() {
    return (
      <div>
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
                  onUserInput={(update) => {this.props.onStateChange('socialSecurityNumber', update);}}/>
              <GenderInput gender={this.props.data.gender}
                  onUserInput={(update) => {this.props.onStateChange('gender', update);}}/>
            </div>
            <div className="small-12 columns">
              <h4>Date of Birth</h4>
              <span className="usa-form-hint usa-datefield-hint" id="dobHint">For example: 04 28 1986</span>
              <DateInput date={this.props.data.dateOfBirth}
                  onUserInput={(update) => {this.props.onStateChange('dateOfBirth', update);}}/>
            </div>
          </div>

          <div className="usa-input-grid usa-input-grid-large">
            <h4>Place of Birth</h4>
            <div>
              <div className="usa-input-grid usa-input-grid-medium">
                <label htmlFor="veteran_city_of_birth">City</label>
                <input type="text" name="veteran[city_of_birth]"/>
              </div>

              <AddressState state={this.props.data.state}
                  onUserInput={(update) => {this.props.onStateChange('state', update);}}/>
            </div>
          </div>
          <div className="row">
            <div className="small-12 columns">
              <label htmlFor="veteran_marital_status">Current Martial Status</label>
              <select name="veteran[marital_status]" >
                <option value=""></option>
                <option value="Married">Married</option>
                <option value="Never Married">Never Married</option>
                <option value="Separated">Separated</option>
                <option value="Widowed">Widowed</option>
                <option value="Divorced">Divorced</option></select>
            </div>
          </div>
        </fieldset>
      </div>
    );
  }
}

export default NameAndGeneralInfoSection;
