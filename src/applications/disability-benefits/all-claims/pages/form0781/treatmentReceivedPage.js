import {
  checkboxGroupSchema,
  checkboxGroupUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleWithTag, form0781HeadingTag } from '../../content/form0781';
import {
  treatmentReceivedDescription,
  treatmentReceivedNoneLabel,
  treatmentReceivedTitle,
  validateProviders,
} from '../../content/form0781/treatmentReceivedPage';
import {
  TREATMENT_RECEIVED_SUBTITLES,
  TREATMENT_RECEIVED_HINTS,
  TREATMENT_RECEIVED_VA,
  TREATMENT_RECEIVED_NON_VA,
} from '../../constants';

export const uiSchema = {
  'ui:title': titleWithTag(treatmentReceivedTitle, form0781HeadingTag),
  'ui:description': treatmentReceivedDescription,
  treatmentReceivedVaProvider: checkboxGroupUI({
    title: TREATMENT_RECEIVED_SUBTITLES.va,
    labelHeaderLevel: '4',
    hint: TREATMENT_RECEIVED_HINTS.va,
    labels: {
      ...TREATMENT_RECEIVED_VA,
    },
    required: false,
  }),
  treatmentReceivedNonVaProvider: checkboxGroupUI({
    title: TREATMENT_RECEIVED_SUBTITLES.nonVa,
    labelHeaderLevel: '4',
    hint: TREATMENT_RECEIVED_HINTS.nonVa,
    labels: {
      ...TREATMENT_RECEIVED_NON_VA,
    },
    required: false,
  }),
  treatmentNoneCheckbox: checkboxGroupUI({
    title: TREATMENT_RECEIVED_SUBTITLES.none,
    labelHeaderLevel: '4',
    hint: TREATMENT_RECEIVED_HINTS.none,
    labels: {
      none: treatmentReceivedNoneLabel,
    },
    required: false,
  }),
  'ui:validations': [validateProviders],
};

export const schema = {
  type: 'object',
  properties: {
    'view:conflictingResponseAlert': {
      type: 'object',
      properties: {},
    },
    treatmentReceivedVaProvider: checkboxGroupSchema(
      Object.keys(TREATMENT_RECEIVED_VA),
    ),
    treatmentReceivedNonVaProvider: checkboxGroupSchema(
      Object.keys(TREATMENT_RECEIVED_NON_VA),
    ),
    treatmentNoneCheckbox: checkboxGroupSchema(['none']),
  },
};
