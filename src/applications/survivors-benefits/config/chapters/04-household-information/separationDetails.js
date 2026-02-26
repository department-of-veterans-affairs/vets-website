import {
  yesNoSchema,
  yesNoUI,
  textUI,
  titleUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isYes } from '../../../utils/helpers';
import { customTextSchema } from '../../definitions';
import { CourtOrderSeparationAlert } from '../../../components/FormAlerts';
import { validations } from '../../validations';

/** @type {PageSchema} */
export default {
  title: 'Separation details',
  path: 'household/separation-details',
  uiSchema: {
    ...titleUI('Separation details'),
    separationExplanation: textUI({
      title: 'Tell us the reason for the separation',
    }),
    separationStartDate: currentOrPastDateUI({
      title: 'Start date of separation',
      monthSelect: false,
    }),
    separationEndDate: {
      ...currentOrPastDateUI({
        title: 'End date of separation',
        monthSelect: false,
      }),
      'ui:validations': [validations.isAfterSeparationStartDate],
    },
    courtOrderedSeparation: yesNoUI({
      title: 'Was the separation due to a court order?',
    }),
    courtOrderAlert: {
      'ui:description': CourtOrderSeparationAlert,
      'ui:options': {
        hideIf: formData => !isYes(formData?.courtOrderedSeparation),
        displayEmptyObjectOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: [
      'separationExplanation',
      'separationStartDate',
      'separationEndDate',
      'courtOrderedSeparation',
    ],
    properties: {
      separationExplanation: customTextSchema,
      separationStartDate: currentOrPastDateSchema,
      separationEndDate: currentOrPastDateSchema,
      courtOrderedSeparation: yesNoSchema,
      courtOrderAlert: {
        type: 'object',
        properties: {},
      },
    },
  },
};
