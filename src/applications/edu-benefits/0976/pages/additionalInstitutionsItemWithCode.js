import React from 'react';
import {
  titleUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getArrayIndexFromPathName } from 'platform/forms-system/src/js/patterns/array-builder/helpers';
import InstitutionSelector from '../components/InstitutionSelector';

// here we're checking for both a well-formatted facility code,
// AND that a valid institution has been fetched and stored in
// formData
const facilityCodeUIValidation = (errors, fieldData, formData) => {
  const facilityCode = (fieldData || '').trim();

  // check for bad formatting
  const badFormat = facilityCode && !/^[a-zA-Z0-9]{8}$/.test(facilityCode);
  const { failedToLoad } = formData;
  if (badFormat || (!badFormat && failedToLoad)) {
    errors.addError(
      'Enter a valid facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
    );
    return;
  }

  // check for duplicates
  const allCodes = [
    formData.primaryInstitutionDetails?.facilityCode,
    ...(formData.additionalInstitutions || []).map(inst => inst.facilityCode),
  ];
  const isDuplicate = allCodes.filter(item => item === facilityCode).length > 1;
  if (isDuplicate) {
    errors.addError(
      'You have already added this facility code to this form. Enter a new facility code, or cancel adding this additional location.',
    );
  }
};

export default {
  uiSchema: {
    ...titleUI(
      'Enter the VA facility code for the additional location you’d like to add',
    ),
    facilityCode: {
      ...textUI({
        title: 'Facility code',
        errorMessages: {
          required:
            'Enter a valid facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
        },
        useAllFormData: true,
      }),
      'ui:validations': [facilityCodeUIValidation],
    },
    'view:institutionSelector': {
      'ui:description': () => {
        const index = getArrayIndexFromPathName();
        return (
          <InstitutionSelector dataPath={`additionalInstitutions.${index}`} />
        );
      },
    },
  },

  schema: {
    type: 'object',
    properties: {
      facilityCode: { ...textSchema, minLength: 8, maxLength: 8 },
      'view:institutionSelector': { type: 'object', properties: {} },
    },
    required: ['facilityCode'],
  },
};
