// web-component-patterns
import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
} from 'platform/forms-system/src/js/web-component-patterns/datePatterns';
import {
  textSchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns/textPatterns';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';

const uiSchema = {
  institutionDetails: {
    ...titleUI('Identifying details'),
    institutionName: {
      ...textUI({
        title: 'Institution name',
        errorMessages: {
          required: "Please enter your institution's name",
        },
      }),
    },
    facilityCode: {
      ...textUI({
        title: 'Facility code',
        hint: '',
        errorMessages: {
          required: "Please enter your institution's facility code",
        },
      }),
      'ui:validations': [
        (errors, fieldData) => {
          if (fieldData && !/^[a-zA-Z0-9]{8}$/.test(fieldData)) {
            errors.addError('Please enter a valid 8-digit facility code');
          }
        },
      ],
    },
    termStartDate: {
      ...currentOrPastDateUI({
        title: 'Term start date',
        errorMessages: {
          required: 'Please enter a term start date',
        },
      }),
    },
    dateOfCalculations: {
      ...currentOrPastDateUI({
        title: 'Date of calculations',
        errorMessages: {
          required: 'Please enter the date these calculations were performed',
        },
      }),
      'ui:validations': [
        {
          validator: (errors, _field, formData) => {
            const {
              termStartDate,
              dateOfCalculations,
            } = formData.institutionDetails;

            if (!termStartDate || !dateOfCalculations) return;

            const startDate = new Date(termStartDate);
            const calculationDate = new Date(dateOfCalculations);

            if (calculationDate < startDate) {
              errors.addError(
                `Calculations can't occur before the term start date. Enter the term start date or a later date`,
              );
            }
          },
        },
      ],
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    institutionDetails: {
      type: 'object',
      properties: {
        institutionName: textSchema,
        facilityCode: textSchema,
        termStartDate: currentOrPastDateSchema,
        dateOfCalculations: currentOrPastDateSchema,
      },
      required: [
        'institutionName',
        'facilityCode',
        'termStartDate',
        'dateOfCalculations',
      ],
    },
  },
};

export { uiSchema, schema };
