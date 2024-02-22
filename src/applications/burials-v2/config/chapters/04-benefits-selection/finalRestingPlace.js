import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import { VaTextInputField } from '@department-of-veterans-affairs/platform-forms-system/web-component-fields';
import { radioUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { restingPlaceLabels } from '../../../utils/labels';
import { generateTitle } from '../../../utils/helpers';

const { finalRestingPlace } = fullSchemaBurials.properties;

export default {
  uiSchema: {
    'ui:title': generateTitle('Final resting place'),
    finalRestingPlace: {
      location: radioUI({
        title:
          'Choose the option that best describes the Veteran’s final resting place',
        labels: restingPlaceLabels,
        classNames: 'vads-u-margin-y--0 vads-u-margin-top--0',
      }),
      other: {
        'ui:title': 'Final resting place of the deceased Veteran’s remains',
        'ui:required': form =>
          get('finalRestingPlace.location', form) === 'other',
        'ui:options': {
          hideIf: form => get('finalRestingPlace.location', form) !== 'other',
        },
        'ui:webComponentField': VaTextInputField,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      finalRestingPlace,
    },
  },
};
