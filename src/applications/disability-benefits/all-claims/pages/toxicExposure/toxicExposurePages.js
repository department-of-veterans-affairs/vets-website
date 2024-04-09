import {
  gulfWar1990Locations,
  toxicExposureConditions,
  gulfWar1990LocationDates,
} from '..';
import { TE_URL_PREFIX } from '../../constants';
import {
  conditionsPageTitle,
  gulfWar1990PageTitle,
  isClaimingTECondition,
  showToxicExposurePages,
} from '../../content/toxicExposure';

export const toxicExposurePages = {
  toxicExposureConditions: {
    title: conditionsPageTitle,
    path: `${TE_URL_PREFIX}/conditions`,
    depends: formData => showToxicExposurePages(formData),
    uiSchema: toxicExposureConditions.uiSchema,
    schema: toxicExposureConditions.schema,
  },
  gulfWar1990Locations: {
    title: gulfWar1990PageTitle,
    path: `${TE_URL_PREFIX}/gulf-war-hazard-1990`,
    depends: formData => isClaimingTECondition(formData),
    uiSchema: gulfWar1990Locations.uiSchema,
    schema: gulfWar1990Locations.schema,
  },
  ...gulfWar1990LocationDates.makePages(),
};
