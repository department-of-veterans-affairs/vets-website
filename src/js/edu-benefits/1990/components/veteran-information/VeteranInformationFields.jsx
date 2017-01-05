import React from 'react';
import moment from 'moment';

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
          },
          dateRange: {
            type: 'object',
            required: ['from'],
            properties: {
              from: {
                title: 'Start date',
                type: 'string',
                pattern: '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$'
              },
              to: {
                title: 'End date',
                type: 'string',
                pattern: '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$'
              },
            }
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
  toursOfDuty: [{
    dateRange: {}
  }]
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
    },
    items: {
      dateRange: {
        'ui:validations': [
          (errors, { to, from }) => {
            if (to && from) {
              const toArray = to.split('-', 2);
              const fromArray = from.split('-', 2);
              const toDate = moment({
                year: toArray[0] === 'XXXX' ? null : toArray[0],
                month: toArray[1] === 'XX' ? null : parseInt(toArray[1], 10) - 1,
                day: toArray[2] === 'XX' ? null : parseInt(toArray[2], 10)
              });
              const fromDate = moment({
                year: fromArray[0] === 'XXXX' ? null : fromArray[0],
                month: fromArray[1] === 'XX' ? null : parseInt(fromArray[1], 10) - 1,
                day: fromArray[2] === 'XX' ? null : parseInt(fromArray[2], 10)
              });

              if (!fromDate.isBefore(toDate)) {
                errors.to.addError('End date must be after start date');
              }
            }
          }
        ],
        from: {
          'ui:field': 'mydate'
        },
        to: {
          'ui:field': 'mydate'
        }
      }
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
