import {
  toxicExposureConditions,
  gulfWar1990Locations,
  gulfWar1990LocationDates,
} from '..';
import {
  conditionsPageTitle,
  gulfWar1990PageTitle,
  isClaimingTECondition,
  showToxicExposurePages,
} from '../../content/toxicExposure';

export const toxicExposurePages = {
  toxicExposureConditions: {
    title: conditionsPageTitle,
    path: 'toxic-exposure-conditions',
    depends: formData => showToxicExposurePages(formData),
    uiSchema: toxicExposureConditions.uiSchema,
    schema: toxicExposureConditions.schema,
  },
  gulfWar1990Locations: {
    title: gulfWar1990PageTitle,
    path: 'gulf-war-hazard-1990',
    depends: formData => isClaimingTECondition(formData),
    uiSchema: gulfWar1990Locations.uiSchema,
    schema: gulfWar1990Locations.schema,
  },
  ...gulfWar1990LocationDates.makePages(),
};
