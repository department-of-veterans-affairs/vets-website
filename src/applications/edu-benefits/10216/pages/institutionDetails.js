import {
  textUI,
  currentOrPastDateUI,
  textSchema,
  currentOrPastDateSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isInvalidTermStartDate, isCurrentOrpastDate } from '../utilities';
import InstitutionName from '../components/InstitutionName';

const institutionDetails = () => ({
  uiSchema: {
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
        'ui:options': {
          showFieldLabel: true,
          keepInPageOnReview: true,
        },
        // 'ui:validations': [
        //   (errors, fieldData, formData) => {
        //     const institutionName =
        //       formData?.institutionDetails?.institutionName;
        //     if (fieldData && !/^[a-zA-Z0-9]{8}$/.test(fieldData)) {
        //       errors.addError('Please enter a valid 8-digit facility code');
        //     } else if (institutionName === 'not found') {
        //       errors.addError(
        //         'Please enter a valid facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
        //       );
        //     }
        //   },
        // ],
      },
      institutionName: {
        'ui:title': 'Institution name',
        'ui:webComponentField': InstitutionName,
      },
      termStartDate: {
        ...currentOrPastDateUI({
          title: 'Term start date',
          errorMessages: {
            required: 'Please enter a start date',
          },
        }),
        'ui:validations': [
          (errors, fieldData) => {
            if (isInvalidTermStartDate(fieldData)) {
              errors.addError(
                'Please provide a term start date within the last 30 days or today',
              );
            } else if (isCurrentOrpastDate(fieldData)) {
              errors.addError('Please provide a valid current or past date');
            }
          },
        ],
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      institutionDetails: {
        type: 'object',
        required: ['facilityCode', 'termStartDate'],
        properties: {
          facilityCode: textSchema,
          institutionName: {
            type: 'string',
          },
          termStartDate: currentOrPastDateSchema,
        },
      },
    },
  },
});

export default institutionDetails;
