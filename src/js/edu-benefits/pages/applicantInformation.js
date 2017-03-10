import _ from 'lodash/fp';

import * as currentOrPastDate from '../../common/schemaform/definitions/currentOrPastDate';
import * as fullName from '../../common/schemaform/definitions/fullName';
import * as ssn from '../../common/schemaform/definitions/ssn';

import definitions from 'vets-json-schema/dist/definitions.json';

import { relationshipLabels, genderLabels } from '../utils/helpers';

const defaultProps = [
  'relativeFullName',
  'relativeSocialSecurityNumber',
  'relativeDateOfBirth',
  'gender',
  'relationship'
];

export default function applicantInformation(
  shema,
  fields = defaultProps,
  required = ['relativeFullName']) {
  const possibleProperties = {
    relativeFullName: fullName.schema,
    relativeSocialSecurityNumber: ssn.schema,
    relativeDateOfBirth: currentOrPastDate.schema,
    gender: definitions.gender,
    relationship: definitions.relationship
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
          labels: genderLabels
        }
      },
      relationship: {
        'ui:widget': 'radio',
        'ui:title': 'What is your relationship to the service member whose benefit is being transferred to you?',
        'ui:options': {
          labels: relationshipLabels
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
