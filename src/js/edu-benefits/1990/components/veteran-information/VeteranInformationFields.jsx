import React from 'react';

import ErrorableCurrentOrPastDate from '../../../../common/components/form-elements/ErrorableCurrentOrPastDate';
import FullName from '../../../../common/components/questions/FullName';
import SocialSecurityNumber from '../../../../common/components/questions/SocialSecurityNumber';
import ErrorableRadioButtons from '../../../../common/components/form-elements/ErrorableRadioButtons';

import { binaryGenders } from '../../utils/options-for-select';
import { isValidDateOver17 } from '../../../../common/utils/validations';
import FormPage from '../../../common/forms/FormPage';

const schema = {
  type: 'object',
  title: 'Personal information',
  required: ['veteranFullName', 'veteranSocialSecurityNumber', 'veteranDateOfBirth'],
  properties: {
    veteranFullName: {
      type: 'object',
      title: '',
      required: ['first', 'last'],
      properties: {
        first: {
          type: 'string',
          title: 'First name'
        },
        middle: {
          type: 'string',
          title: 'Middle name'
        },
        last: {
          type: 'string',
          title: 'Last name',
          minLength: 1,
          maxLength: 30
        },
        suffix: {
          type: 'string',
          title: 'Suffix',
          'enum': [
            '',
            'Jr.',
            'Sr.',
            'II',
            'III',
            'IV'
          ]
        }
      }
    },
    veteranSocialSecurityNumber: {
      title: 'Social security number',
      type: 'string',
      pattern: '^([0-9]{3}-[0-9]{2}-[0-9]{4}|[0-9]{9})$'
    },
    veteranDateOfBirth: {
      title: 'Date of birth',
      type: 'string',
      pattern: '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$'
    },
    gender: {
      title: 'Gender',
      type: 'string',
      'enum': ['F', 'M'],
      enumNames: ['Female', 'Male']
    }
  }
};

const errorMessages = {
  veteranSocialSecurityNumber: {
    pattern: 'Please enter a valid nine digit SSN (dashes allowed)'
  }
};
const formData = {
};
const uiSchema = {
  veteranSocialSecurityNumber: {
    'ui:options': {
      widgetClassNames: 'usa-input-medium'
    }
  },
  veteranDateOfBirth: {
    'ui:field': 'mydate'
  },
  gender: {
    'ui:widget': 'radio'
  }
};

export default class PersonalInformationFields extends React.Component {
  render() {
    return (
      <FormPage uiSchema={uiSchema} schema={schema} formData={formData} errorMessages={errorMessages}/>
    );
  }
  oldRender() {
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
