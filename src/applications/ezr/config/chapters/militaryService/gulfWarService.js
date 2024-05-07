import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import GulfWarServiceDescription from '../../../components/FormDescriptions/GulfWarServiceDescription';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    'ui:title': content['military-service-gulf-war-service-title'],
    gulfWarService: radioUI({
      classNames: 'custom-hide-label',
      useFormsPattern: 'single',
      formHeading: content['military-service-gulf-war-service-description'],
      formDescription: GulfWarServiceDescription,
      formHeadingLevel: 5,
      labels: {
        '1': 'Yes',
        '2': 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      gulfWarService: radioSchema(['1', '2']),
    },
  },
};
