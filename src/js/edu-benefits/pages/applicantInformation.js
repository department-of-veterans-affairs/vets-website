import _ from 'lodash/fp';

import * as currentOrPastDate from '../../common/schemaform/definitions/currentOrPastDate';
import * as fullName from '../../common/schemaform/definitions/fullName';
import * as ssn from '../../common/schemaform/definitions/ssn';

import { relationshipLabels, genderLabels } from '../utils/helpers';

const defaults = {
  fields: [
    'relativeFullName',
    'relativeSocialSecurityNumber',
    'relativeDateOfBirth',
    'gender',
    'relationship'
  ],
  required: [
    'relativeFullName',
    'relativeSocialSecurityNumber',
    'relativeDateOfBirth',
    'relationship'
  ],
  labels: {}
};


/**
 * Returns an applicantInformation page based on the options passed.
 *
 * @param {Object} schema   The full schema for the form
 * @param {Object} options  Options to override the defaults above
 */
export default function applicantInformation(schema, options) {
  // Use the defaults as necessary, but override with the options given
  const mergedOptions = _.assign(defaults, options);
  const { fields, required, labels } = mergedOptions;

  const possibleProperties = {
    relativeFullName: schema.definitions.fullName,
    relativeSocialSecurityNumber: schema.definitions.ssn,
    relativeDateOfBirth: schema.definitions.date,
    gender: schema.definitions.gender,
    relationship: schema.definitions.relationship
  };

  return {
    path: 'applicant/information',
    title: 'Applicant information',
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
