import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import {
  gulfWar1990PageTitle,
  gulfWar1990Question,
} from '../../content/toxicExposure';
import { formTitle } from '../../utils';

const locationOptions = {
  AFGHANISTAN: 'Afghanistan',
  BAHRAIN: 'Bahrain',
  EGYPT: 'Egypt',
  IRAQ: 'Iraq',
  ISRAEL: 'Israel',
  JORDAN: 'Jordan',
  KUWAIT: 'Kuwait',
  NEUTRAL_ZONE: 'Neutral zone between Iraq and Saudi Arabia',
  OMAN: 'Oman',
  QATAR: 'Qatar',
  SAUDI_ARABIA: 'Saudi Arabia',
  SOMALIA: 'Somalia',
  SYRIA: 'Syria',
  UAE: 'The United Arab Emirates (UAE)',
  TURKEY: 'Turkey',
  WATERS:
    'The waters of the Arabian Sea, Gulf of Aden, Gulf of Oman, Persian Gulf, and Red Sea',
  AIRSPACE: 'The airspace above any of these locations',
};

export const uiSchema = {
  'ui:title': formTitle(gulfWar1990PageTitle),
  gulfWarHazard1990: {
    locations: checkboxGroupUI({
      title: gulfWar1990Question,
      labels: locationOptions,
      required: false,
      uswds: false,
    }),
  },
};

export const schema = {
  type: 'object',
  properties: {
    gulfWarHazard1990: {
      type: 'object',
      properties: {
        locations: checkboxGroupSchema(Object.keys(locationOptions)),
      },
    },
  },
};
