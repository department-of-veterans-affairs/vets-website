import {
  yesNoSchema,
  yesNoUI,
  textUI,
  textSchema,
  titleUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isYes } from '../../../utils/helpers';
import { CourtOrderSeparationAlert } from '../../../components/FormAlerts';

/** @type {PageSchema} */
export default {
  title: 'Separation details',
  path: 'household/separation-details',
  depends: formData =>
    formData.separationReason === 'RELATIONSHIP_DIFFERENCES' ||
    formData.separationReason === 'OTHER',
  uiSchema: {
    ...titleUI('Separation details'),
    separationReasonExplanation: textUI({
      title: 'Tell us the reason for the separation',
    }),
    separationStartDate: currentOrPastDateUI({
      title: 'Start date of separation',
      monthSelect: false,
    }),
    separationEndDate: currentOrPastDateUI({
      title: 'End date of separation',
      monthSelect: false,
    }),
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
      'separationReasonExplanation',
      'separationStartDate',
      'separationEndDate',
      'courtOrderedSeparation',
    ],
    properties: {
      separationReasonExplanation: textSchema,
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
