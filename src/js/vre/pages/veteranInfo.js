import _ from 'lodash/fp';

import currentOrPastDateUI from '../../common/schemaform/definitions/currentOrPastDate';
import fullNameUI from '../../common/schemaform/definitions/fullName';
import ssnUI from '../../common/schemaform/definitions/ssn';

export default function createVeteranInfoPage(schema, extra) {
  const {
    veteranFullName,
    veteranDateOfBirth,
    veteranSocialSecurityNumber,
    veteranVaFileNumber
  } = schema.properties;

  return {
    title: 'Veteran Inforation',
    path: 'veteran-information',
    uiSchema: _.merge({
      veteranFullName: fullNameUI,
      veteranDateOfBirth: currentOrPastDateUI('Date of birth'),
      veteranSocialSecurityNumber: _.assign(ssnUI, {
        'ui:title': 'Social Security number (must have this or a VA file number)',
        'ui:required': form => !form.veteranVaFileNumber,
      }),
      veteranVaFileNumber: {
        'ui:title': 'VA file number (must have this or a Social Security number)',
        'ui:required': form => !form.veteranSocialSecurityNumber,
        'ui:errorMessages': {
          pattern: 'Your VA file number must be between 7 to 9 digits'
        }
      }
    }, extra.uiSchema),
    schema: {
      type: 'object',
      required: ['veteranDateOfBirth'],
      properties: _.merge({
        veteranFullName,
        veteranDateOfBirth,
        veteranSocialSecurityNumber,
        veteranVaFileNumber,
      }, extra.schema)
    }
  };
}
