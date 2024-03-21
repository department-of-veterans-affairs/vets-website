import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  gulfWar1990PageTitle,
  gulfWar1990Question,
} from '../../content/toxicExposure';
import { formTitle } from '../../utils';
import { GULF_WAR_1990_LOCATIONS } from '../../constants';

export const uiSchema = {
  'ui:title': formTitle(gulfWar1990PageTitle),
  gulfWar1990: checkboxGroupUI({
    title: gulfWar1990Question,
    labels: GULF_WAR_1990_LOCATIONS,
    required: false,
    uswds: false,
  }),
};

export const schema = {
  type: 'object',
  properties: {
    gulfWar1990: checkboxGroupSchema(Object.keys(GULF_WAR_1990_LOCATIONS)),
  },
};
