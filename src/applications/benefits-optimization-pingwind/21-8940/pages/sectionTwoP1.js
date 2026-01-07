import {
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import SafeArrayField from '../components/SafeArrayField';
import { DisabilityView } from '../components/viewElements';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Service-connected Disabilities',
    'ui:description': 'Tell us about your service-connected disabilities.',

    disabilityDescription: {
      'ui:field': SafeArrayField,
      'ui:options': {
        itemName: 'Disability',
        viewField: DisabilityView,
        customTitle: 'Service-connected disabilities',
        keepInPageOnReview: true,
        doNotScroll: true,
        confirmRemove: true,
        confirmRemoveDescription:
          'Are you sure you want to remove this disability?',
        addAnotherText: 'Add another disability',
      },
      items: {
        disability: textUI({
          title:
            'What service-connected disability prevents you from getting or keeping a job?',
          useDlWrap: true,
        }),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      disabilityDescription: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            disability: textSchema,
          },
          required: ['disability'],
        },
      },
    },
    required: ['disabilityDescription'],
  },
};
