import React from 'react';
import {
  titleUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import InstitutionSelector from '../components/InstitutionSelector';

// here we're checking for both a well-formatted facility code,
// AND that a valid institution has been fetched and stored in
// formData
const facilityCodeUIValidation = (errors, fieldData, formData) => {
  const facilityCode = (fieldData || '').trim();

  const badFormat = facilityCode && !/^[a-zA-Z0-9]{8}$/.test(facilityCode);

  const { failedToLoad } = formData.primaryInstitutionDetails;

  if (badFormat || (!badFormat && failedToLoad)) {
    errors.addError(
      'Enter a valid facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
    );
  }
};

export default {
  uiSchema: {
    ...titleUI(
      'If your institution has a VA facility code, please enter it below',
    ),
    primaryInstitutionDetails: {
      facilityCode: {
        ...textUI({
          title: 'Facility code',
          errorMessages: {
            required:
              'Enter a valid facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
          },
        }),
        'ui:validations': [facilityCodeUIValidation],
      },
      'view:institutionSelector': {
        'ui:description': (
          <InstitutionSelector dataPath="primaryInstitutionDetails" />
        ),
      },
    },
  },

  schema: {
    type: 'object',
    properties: {
      primaryInstitutionDetails: {
        type: 'object',
        properties: {
          facilityCode: { ...textSchema, minLength: 8, maxLength: 8 },
          'view:institutionSelector': { type: 'object', properties: {} },
        },
        required: ['facilityCode'],
      },
    },
  },
};
