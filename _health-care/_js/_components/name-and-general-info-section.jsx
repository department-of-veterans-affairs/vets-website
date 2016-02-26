import React from 'react';

import DateInput from './date-input';
import FullName from './full-name';
import MothersMaidenName from './mothers-maiden-name';
import SocialSecurityNumber from './social-security-number';
import GenderInput from './gender-input';

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
              <GenderInput name={this.props.data.gender}
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

              <div className="usa-input-grid usa-input-grid-small">
                <label htmlFor="veteran_state_of_birth">State</label>
                <select name="veteran[state_of_birth]" ><option value="0"></option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AS">American Samoa</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="DC">District Of Columbia</option>
                  <option value="FM">Federated States Of Micronesia</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="GU">Guam</option>
                  <option value="HI">Hawaii</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="IA">Iowa</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="ME">Maine</option>
                  <option value="MH">Marshall Islands</option>
                  <option value="MD">Maryland</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option>
                  <option value="MT">Montana</option>
                  <option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NY">New York</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="MP">Northern Mariana Islands</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PW">Palau</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="PR">Puerto Rico</option>
                  <option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VT">Vermont</option>
                  <option value="VI">Virgin Islands</option>
                  <option value="VA">Virginia</option>
                  <option value="WA">Washington</option>
                  <option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WY">Wyoming</option>
                </select>
              </div>
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
