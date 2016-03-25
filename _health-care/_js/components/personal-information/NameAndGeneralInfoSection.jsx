import React from 'react';

import DateInput from '../form-elements/DateInput';
import ErrorableSelect from '../form-elements/ErrorableSelect';
import FullName from '../questions/FullName';
import Gender from '../questions/Gender';
import MothersMaidenName from './MothersMaidenName';
import SocialSecurityNumber from '../questions/SocialSecurityNumber';
import State from '../questions/State';

import { maritalStatuses } from '../../utils/options-for-select.js';

class NameAndGeneralInfoSection extends React.Component {
  render() {
    return (
      <fieldset>
        <div className="input-section">
          <h4>Veteran's Name</h4>
          <FullName required
              value={this.props.data.fullName}
              onUserInput={(update) => {this.props.onStateChange('fullName', update);}}/>
          <MothersMaidenName value={this.props.data.mothersMaidenName}
              onUserInput={(update) => {this.props.onStateChange('mothersMaidenName', update);}}/>
          <SocialSecurityNumber required
              ssn={this.props.data.socialSecurityNumber}
              onValueChange={(update) => {this.props.onStateChange('socialSecurityNumber', update);}}/>
          <Gender value={this.props.data.gender} onUserInput={(update) => {this.props.onStateChange('gender', update);}}/>
          <DateInput required
              day={this.props.data.dateOfBirth.day}
              month={this.props.data.dateOfBirth.month}
              year={this.props.data.dateOfBirth.year}
              onValueChange={(update) => {this.props.onStateChange('dateOfBirth', update);}}/>
        </div>


        <div className="input-section">
          <h4>Place of Birth</h4>
          <label htmlFor="veteran_city_of_birth">City</label>
          <input type="text" name="veteran[city_of_birth]"/>
          <State value={this.props.data.state} onUserInput={(update) => {this.props.onStateChange('state', update);}}/>
          <ErrorableSelect label="Current Marital Status"
              options={maritalStatuses}
              value={this.props.data.maritalStatus}
              onValueChange={(update) => {this.props.onStateChange('maritalStatus', update);}}/>
        </div>
      </fieldset>
    );
  }
}

export default NameAndGeneralInfoSection;
