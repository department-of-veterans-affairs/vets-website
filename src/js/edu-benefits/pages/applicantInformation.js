import _ from 'lodash/fp';

import * as currentOrPastDate from '../../common/schemaform/definitions/currentOrPastDate';
import * as fullName from '../../common/schemaform/definitions/fullName';
import * as ssn from '../../common/schemaform/definitions/ssn';

import { relationshipLabels, genderLabels } from '../utils/helpers';

const defaultProps = [
  'relativeFullName',
  'relativeSocialSecurityNumber',
  'relativeDateOfBirth',
  'gender',
  'relationship'
];

export default function applicantInformation(
  schema,
  fields = defaultProps,
  labels = {},
  required = ['relativeFullName', 'relativeSocialSecurityNumber']) {
  const possibleProperties = {
    relativeFullName: schema.definitions.fullName,
    relativeSocialSecurityNumber: schema.definitions.ssn,
    relativeDateOfBirth: schema.definitions.date,
    gender: schema.definitions.gender,
    relationship: schema.definitions.relationship
  };

  return {
    path: 'applicant-information',
    title: 'Applicant Information',
    initialData: {},
    uiSchema: {
      'ui:order': fields,
      relativeFullName: fullName.uiSchema,
      relativeSocialSecurityNumber: ssn.uiSchema,
      relativeDateOfBirth: currentOrPastDate.uiSchema('Date of birth'),
      gender: {
        'ui:widget': 'radio',
        'ui:title': 'Gender',
        'ui:options': {
          labels: labels.gender || genderLabels
        }
      },
      relationship: {
        'ui:widget': 'radio',
        'ui:title': 'What is your relationship to the service member whose benefit is being transferred to you?',
        'ui:options': {
          labels: labels.relationship || relationshipLabels
        }
      }
    },
    schema: {
      type: 'object',
      required,
      properties: _.pick(fields, possibleProperties)
    }
  };
}
