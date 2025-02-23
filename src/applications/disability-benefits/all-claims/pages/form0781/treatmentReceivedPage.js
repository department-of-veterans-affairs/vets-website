import {
  checkboxGroupSchema,
  checkboxGroupUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleWithTag, form0781HeadingTag } from '../../content/form0781';
import {
  treatmentReceivedDescription,
  treatmentReceivedNoneLabel,
  treatmentReceivedTitle,
  validateBehaviorSelections,
  behaviorListValidationError,
  showConflictingAlert,
} from '../../content/form0781/treatmentReceivedPage';
import {
  TREATMENT_RECEIVED_SUBTITLES,
  TREATMENT_RECEIVED_VA,
  TREATMENT_RECEIVED_NON_VA,
} from '../../constants';

export const uiSchema = {
  'ui:title': titleWithTag(treatmentReceivedTitle, form0781HeadingTag),
  'ui:description': treatmentReceivedDescription,
  'view:conflictingResponseAlert': {
    'ui:description': behaviorListValidationError,
    'ui:options': {
      hideIf: formData => showConflictingAlert(formData) === false,
    },
  },
  treatmentReceivedVAProvider: checkboxGroupUI({
    title: TREATMENT_RECEIVED_SUBTITLES.va,
    labelHeaderLevel: '4',
    labels: {
      ...TREATMENT_RECEIVED_VA,
    },
    required: false,
  }),
  treatmentReceivedNonVAProvider: checkboxGroupUI({
    title: TREATMENT_RECEIVED_SUBTITLES.nonVA,
    labelHeaderLevel: '4',
    labels: {
      ...TREATMENT_RECEIVED_NON_VA,
    },
    required: false,
  }),
  'view:noneCheckbox': checkboxGroupUI({
    title: TREATMENT_RECEIVED_SUBTITLES.none,
    labelHeaderLevel: '4',
    labels: {
      none: treatmentReceivedNoneLabel,
    },
    required: false,
  }),
  'ui:validations': [validateBehaviorSelections],
};

export const schema = {
  type: 'object',
  properties: {
    'view:conflictingResponseAlert': {
      type: 'object',
      properties: {},
    },
    treatmentReceivedVAProvider: checkboxGroupSchema(
      Object.keys(TREATMENT_RECEIVED_VA),
    ),
    treatmentReceivedNonVAProvider: checkboxGroupSchema(
      Object.keys(TREATMENT_RECEIVED_NON_VA),
    ),
    'view:noneCheckbox': checkboxGroupSchema(['none']),
  },
};
