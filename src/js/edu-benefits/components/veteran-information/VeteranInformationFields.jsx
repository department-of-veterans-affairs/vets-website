import React from 'react';

import DateInput from '../../../common/components/form-elements/DateInput';
import FullName from '../../../common/components/questions/FullName';
import SocialSecurityNumber from '../../../common/components/questions/SocialSecurityNumber';
import Gender from '../../../common/components/questions/Gender';

export default class PersonalInformationFields extends React.Component {
  render() {
    return (
      <fieldset>
        <p>(<span className="form-required-span">*</span>) Indicates a required field</p>
        <legend>Personal Information</legend>
        <div className="input-section">
          <FullName required
              name={this.props.data.veteranFullName}
              onUserInput={(update) => {this.props.onStateChange('veteranFullName', update);}}/>
          <SocialSecurityNumber required
              ssn={this.props.data.veteranSocialSecurityNumber}
              onValueChange={(update) => {this.props.onStateChange('veteranSocialSecurityNumber', update);}}/>
          <DateInput required
              name="veteranBirth"
              day={this.props.data.veteranDateOfBirth.day}
              month={this.props.data.veteranDateOfBirth.month}
              year={this.props.data.veteranDateOfBirth.year}
              onValueChange={(update) => {this.props.onStateChange('veteranDateOfBirth', update);}}/>
          <Gender
              value={this.props.data.gender}
              onUserInput={(update) => {this.props.onStateChange('gender', update);}}/>
        </div>
      </fieldset>
    );
  }
}

PersonalInformationFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired
};
