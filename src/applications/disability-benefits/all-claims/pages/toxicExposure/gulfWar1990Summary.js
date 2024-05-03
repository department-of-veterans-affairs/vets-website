import { GULF_WAR_1990_LOCATIONS, TE_URL_PREFIX } from '../../constants';
import { toxicExposureSummary } from '../../content/toxicExposureSummary';
import { gulfWar1990PageTitle } from '../../content/toxicExposure';
import { formTitle } from '../../utils';

export const uiSchema = {
  'ui:title': formTitle(gulfWar1990PageTitle),
  'ui:description': formData =>
    toxicExposureSummary(
      formData,
      'gulfWar1990',
      GULF_WAR_1990_LOCATIONS,
      'gulfWar1990Details',
      'go back and edit locations and dates for service after August 2, 1990',
      `${TE_URL_PREFIX}/gulf-war-hazard-1990`,
    ),
};

export const schema = {
  type: 'object',
  properties: {},
};
