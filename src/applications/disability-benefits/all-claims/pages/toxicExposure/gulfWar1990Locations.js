import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import {
  gulfWar1990PageTitle,
  gulfWar1990Question,
} from '../../content/toxicExposure';
import { formTitle } from '../../utils';

export const locationOptions = {
  afghanistan: 'Afghanistan',
  bahrain: 'Bahrain',
  egypt: 'Egypt',
  iraq: 'Iraq',
  israel: 'Israel',
  jordan: 'Jordan',
  kuwait: 'Kuwait',
  neutralzone: 'Neutral zone between Iraq and Saudi Arabia',
  oman: 'Oman',
  qatar: 'Qatar',
  saudiarabia: 'Saudi Arabia',
  somalia: 'Somalia',
  syria: 'Syria',
  uae: 'The United Arab Emirates (UAE)',
  turkey: 'Turkey',
  waters:
    'The waters of the Arabian Sea, Gulf of Aden, Gulf of Oman, Persian Gulf, and Red Sea',
  airspace: 'The airspace above any of these locations',
};

export const uiSchema = {
  'ui:title': formTitle(gulfWar1990PageTitle),
  gulfWar1990: checkboxGroupUI({
    title: gulfWar1990Question,
    labels: locationOptions,
    required: false,
    uswds: false,
  }),
};

export const schema = {
  type: 'object',
  properties: {
    gulfWar1990: checkboxGroupSchema(Object.keys(locationOptions)),
  },
};
