import { GULF_WAR_2001_LOCATIONS, TE_URL_PREFIX } from '../../constants';
import { gulfWar2001PageTitle } from '../../content/toxicExposure';
import { toxicExposureSummary } from '../../content/toxicExposureSummary';
import { formTitle } from '../../utils';

export const uiSchema = {
  'ui:title': formTitle(gulfWar2001PageTitle),
  'ui:description': formData =>
    toxicExposureSummary(
      formData,
      'gulfWar2001',
      GULF_WAR_2001_LOCATIONS,
      'gulfWar2001Details',
      'go back and edit locations and dates for service post-9/11',
      `${TE_URL_PREFIX}/gulf-war-2001`,
    ),
};

export const schema = {
  type: 'object',
  properties: {},
};
