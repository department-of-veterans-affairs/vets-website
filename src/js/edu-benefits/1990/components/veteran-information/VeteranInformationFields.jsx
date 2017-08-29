import PropTypes from 'prop-types';
import React from 'react';

import ErrorableCurrentOrPastDate from '../../../../common/components/form-elements/ErrorableCurrentOrPastDate';
import FullName from '../../../../common/components/questions/FullName';
import SocialSecurityNumber from '../../../../common/components/questions/SocialSecurityNumber';
import ErrorableRadioButtons from '../../../../common/components/form-elements/ErrorableRadioButtons';

import { binaryGenders } from '../../utils/options-for-select';
import { isValidDateOver17 } from '../../../../common/utils/validations';

export default class PersonalInformationFields extends React.Component {
  render() {
    const { day, month, year } = this.props.data.veteranDateOfBirth;
    return (
      <fieldset>
        <p>You aren’t required to fill in <strong>all</strong> fields, but VA can evaluate your claim faster if you provide more information.</p>
        <p><span className="form-required-span">*</span>Indicates a required field</p>
        <div className="input-section">
          <FullName required
            name={this.props.data.veteranFullName}
            onUserInput={(update) => {this.props.onStateChange('veteranFullName', update);}}/>
          <SocialSecurityNumber required
            ssn={this.props.data.veteranSocialSecurityNumber}
            onValueChange={(update) => {this.props.onStateChange('veteranSocialSecurityNumber', update);}}/>
          <ErrorableCurrentOrPastDate required
            validation={{
              valid: isValidDateOver17(day.value, month.value, year.value),
              message: 'You must be at least 17 to apply'
            }}
            invalidMessage="Please provide a valid date of birth"
            name="veteranBirth"
            date={this.props.data.veteranDateOfBirth}
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
  onStateChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};
