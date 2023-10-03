import {
  ssnUI,
  ssnSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
  serviceNumberUI,
  serviceNumberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleH1UI } from '../components/customTitlePattern';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleH1UI('Your identification information'),
    veteranSSN: ssnUI(),
    veteranVaFileNumber: vaFileNumberUI(),
    veteranServiceNumber: serviceNumberUI(),
  },
  schema: {
    type: 'object',
    required: ['veteranSSN'],
    properties: {
      veteranSSN: ssnSchema,
      veteranVaFileNumber: vaFileNumberSchema,
      veteranServiceNumber: serviceNumberSchema,
    },
  },
};
