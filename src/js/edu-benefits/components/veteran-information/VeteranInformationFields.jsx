import React from 'react';

import DateInput from '../../../common/components/form-elements/DateInput';
import FullName from '../../../common/components/questions/FullName';
import SocialSecurityNumber from '../../../common/components/questions/SocialSecurityNumber';
import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';

import { binaryGenders } from '../../utils/options-for-select';
import { isValidDateOver17, isValidAnyDate, validateIfDirtyDate } from '../../../common/utils/validations';

function getDateMessage({ month, day, year }) {
  if (isValidAnyDate(day.value, month.value, year.value)
      && !isValidDateOver17(day.value, month.value, year.value)) {
    return 'You must be at least 17 to apply';
  }

  return 'Please provide a valid date of birth';
}

export default class PersonalInformationFields extends React.Component {
  render() {
    return (
      <fieldset>
        <p>You aren’t required to fill in <strong>all</strong> fields, but VA can evaluate your claim faster if you provide more information.</p>
        <p><span className="form-required-span">*</span>Indicates a required field</p>
        <legend className="hide-for-small-only">Veteran information</legend>
        <div className="input-section">
          <FullName required
              name={this.props.data.veteranFullName}
              onUserInput={(update) => {this.props.onStateChange('veteranFullName', update);}}/>
          <SocialSecurityNumber required
              ssn={this.props.data.veteranSocialSecurityNumber}
              onValueChange={(update) => {this.props.onStateChange('veteranSocialSecurityNumber', update);}}/>
          <DateInput required
              errorMessage={getDateMessage(this.props.data.veteranDateOfBirth)}
              validation={validateIfDirtyDate(this.props.data.veteranDateOfBirth.day, this.props.data.veteranDateOfBirth.month, this.props.data.veteranDateOfBirth.year, isValidDateOver17)}
              name="veteranBirth"
              day={this.props.data.veteranDateOfBirth.day}
              month={this.props.data.veteranDateOfBirth.month}
              year={this.props.data.veteranDateOfBirth.year}
              onValueChange={(update) => {this.props.onStateChange('veteranDateOfBirth', update);}}/>
          <ErrorableRadioButtons
              label="Gender"
              name="gender"
              options={binaryGenders}
              value={this.props.data.gender}
              onValueChange={(update) => {this.props.onStateChange('gender', update);}}/>
        </div>
      </fieldset>
    );
  }
}

PersonalInformationFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired
};
