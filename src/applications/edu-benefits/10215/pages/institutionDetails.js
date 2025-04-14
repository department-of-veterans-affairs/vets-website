// web-component-patterns
import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
} from '~/platform/forms-system/src/js/web-component-patterns/datePatterns';
import {
  textSchema,
  textUI,
} from '~/platform/forms-system/src/js/web-component-patterns/textPatterns';
import { titleUI } from '~/platform/forms-system/src/js/web-component-patterns/titlePattern';
import {
  isTermEndBeforeTermStartDate,
  isWithinThirtyDaysLogic,
  getTodayDateYyyyMmDd,
  isCurrentOrPastDate,
} from '../helpers';
import InstitutionName from '../components/InstitutionName';

function validateTermStartDate(errors, xyz, formData, schema, errorMessages) {
  const today = getTodayDateYyyyMmDd();
  const { termStartDate } = formData.institutionDetails;

  if (isCurrentOrPastDate(termStartDate)) {
    errors.addError(
      `Calculations can't occur before the term start date.
      Enter the term start date or a later date.`,
    );
  }

  if (!isWithinThirtyDaysLogic(today, termStartDate)) {
    errors.addError(errorMessages.pattern);
  }
}

function validateDateOfCalculations(
  errors,
  xyz,
  formData,
  schema,
  errorMessages,
) {
  const { termStartDate, dateOfCalculations } = formData.institutionDetails;
  if (!termStartDate || !dateOfCalculations) return;

  if (isCurrentOrPastDate(dateOfCalculations)) {
    errors.addError(
      `This date must be on or after, but not later than 30 days after,
       the start of the term. You cannot enter a future date.`,
    );
  }

  if (isTermEndBeforeTermStartDate(termStartDate, dateOfCalculations)) {
    errors.addError(
      `This date must be on or after, but not later than 30 days after,
       the start of the term. If you are outside of this date range,
       contact your Education Liaison Representative.`,
    );
  }

  if (!isWithinThirtyDaysLogic(termStartDate, dateOfCalculations)) {
    errors.addError(errorMessages.pattern);
  }
}

const uiSchema = {
  institutionDetails: {
    ...titleUI('Institution details'),
    facilityCode: {
      ...textUI({
        title: 'Facility code',
        hint: '',
        errorMessages: {
          required:
            'Please enter a valid facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
        },
      }),
      'ui:validations': [
        (errors, fieldData, formData) => {
          const institutionName = formData?.institutionDetails?.institutionName;
          if (fieldData && !/^[a-zA-Z0-9]{8}$/.test(fieldData)) {
            errors.addError('Please enter a valid 8-digit facility code');
          } else if (institutionName === 'not found') {
            errors.addError(
              'Please enter a valid facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
            );
          }
        },
      ],
    },
    institutionName: {
      'ui:title': 'Institution name',
      'ui:webComponentField': InstitutionName,
    },
    termStartDate: {
      ...currentOrPastDateUI({
        title: 'Term start date',
        errorMessages: {
          required: 'Please enter a term start date',
        },
      }),
      'ui:validations': [validateTermStartDate],
      'ui:errorMessages': {
        pattern: `You cannot enter calculations for a term that started more than 30 days ago.
         The deadline has passed. Contact your Education Liaison Representative.`,
        required: 'Please enter a term start date',
      },
    },
    dateOfCalculations: {
      ...currentOrPastDateUI({
        title: 'Date of calculations',
      }),
      'ui:validations': [validateDateOfCalculations],
      'ui:errorMessages': {
        pattern: `This date must be on or after, but not later than 30 days
         after, the start of the term. You cannot enter a future date.`,
        required: 'Please enter the date these calculations were performed',
      },
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    institutionDetails: {
      type: 'object',
      properties: {
        facilityCode: textSchema,
        institutionName: {
          type: 'string',
        },
        termStartDate: currentOrPastDateSchema,
        dateOfCalculations: currentOrPastDateSchema,
      },
      required: ['facilityCode', 'termStartDate', 'dateOfCalculations'],
    },
  },
};

export { uiSchema, schema };
