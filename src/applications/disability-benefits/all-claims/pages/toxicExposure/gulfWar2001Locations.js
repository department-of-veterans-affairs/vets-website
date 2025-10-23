import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { formTitle } from '../../utils';
import { GULF_WAR_2001_LOCATIONS } from '../../constants';
import {
  gulfWar2001PageTitle,
  gulfWar2001Question,
  validateSelections,
} from '../../content/toxicExposure';

export const uiSchema = {
  'ui:title': formTitle(gulfWar2001PageTitle),
  toxicExposure: {
    gulfWar2001: checkboxGroupUI({
      title: gulfWar2001Question,
      labels: GULF_WAR_2001_LOCATIONS,
      required: false,
    }),
  },
  'ui:validations': [
    {
      validator: (errors, formData) => {
        validateSelections(errors, formData, 'gulfWar2001');
      },
    },
  ],
};

export const schema = {
  type: 'object',
  properties: {
    toxicExposure: {
      type: 'object',
      properties: {
        gulfWar2001: checkboxGroupSchema(Object.keys(GULF_WAR_2001_LOCATIONS)),
      },
    },
  },
};
