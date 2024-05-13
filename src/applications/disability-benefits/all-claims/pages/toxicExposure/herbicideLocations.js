import {
  checkboxGroupUI,
  checkboxGroupSchema,
  textareaUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  herbicidePageTitle,
  herbicideQuestion,
} from '../../content/toxicExposure';
import { formTitle } from '../../utils';
import { HERBICIDE_LOCATIONS } from '../../constants';

export const uiSchema = {
  'ui:title': formTitle(herbicidePageTitle),
  herbicide: checkboxGroupUI({
    title: herbicideQuestion,
    labels: HERBICIDE_LOCATIONS,
    required: false,
  }),
  otherHerbicideLocation: textareaUI({
    title: 'Other locations not listed here',
  }),
};

export const schema = {
  type: 'object',
  properties: {
    herbicide: checkboxGroupSchema(Object.keys(HERBICIDE_LOCATIONS)),
    otherHerbicideLocation: {
      type: 'string',
      maxLength: 250,
    },
  },
};
