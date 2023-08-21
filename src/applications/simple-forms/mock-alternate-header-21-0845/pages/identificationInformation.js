import {
  ssnUI,
  ssnSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
  serviceNumberUI,
  serviceNumberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleH1Schema, titleH1UI } from '../components/customTitlePattern';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'view:title': titleH1UI('Your identification information'),
    veteranSSN: ssnUI(),
    veteranVaFileNumber: vaFileNumberUI(),
    veteranServiceNumber: serviceNumberUI(),
  },
  schema: {
    type: 'object',
    required: ['veteranSSN'],
    properties: {
      'view:title': titleH1Schema,
      veteranSSN: ssnSchema,
      veteranVaFileNumber: vaFileNumberSchema,
      veteranServiceNumber: serviceNumberSchema,
    },
  },
};
