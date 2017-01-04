import React from 'react';

import FormPage from '../../../../common/forms/FormPage';

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
    group: {
      type: 'object',
      required: ['hasGender'],
      properties: {
        hasGender: {
          title: 'Do you feel comfortable providing your gender?',
          type: 'string',
          'enum': ['Y', 'N'],
          enumNames: ['Yes', 'No']
        },
        gender: {
          title: 'Gender',
          type: 'string',
          'enum': ['F', 'M'],
          enumNames: ['Female', 'Male']
        }
      }
    },
    toursOfDuty: {
      type: 'array',
      title: 'Service periods',
      items: {
        type: 'object',
        required: ['branch'],
        properties: {
          branch: {
            type: 'string',
            title: 'Branch of service'
          }
        }
      }
    }
  }
};

const errorMessages = {
  veteranSocialSecurityNumber: {
    pattern: 'Please enter a valid nine digit SSN (dashes allowed)'
  }
};
const formData = {
  toursOfDuty: [{}]
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
  group: {
    'ui:field': 'expandableGroup',
    'ui:options': {
      questionField: 'hasGender',
      expandingField: 'gender',
      questionMatchValue: 'Y'
    },
    hasGender: {
      'ui:widget': 'radio'
    },
    gender: {
      'ui:widget': 'radio'
    }
  },
  toursOfDuty: {
    'ui:options': {
      viewField: (props) => <div>{props.formData.branch}<button onClick={props.onEdit}>Edit</button></div>,
    }
  }
};

export default class PersonalInformationFields extends React.Component {
  render() {
    return (
      <div className="input-section">
        <FormPage uiSchema={uiSchema} schema={schema} formData={formData} errorMessages={errorMessages}/>
      </div>
    );
  }
}
