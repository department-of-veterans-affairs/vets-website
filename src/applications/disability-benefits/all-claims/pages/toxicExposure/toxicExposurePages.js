import { toxicExposureConditions, gulfWarHazard1990 } from '..';
import {
  conditionsPageTitle,
  gulfWar1990PageTitle,
  isClaimingTECondition,
} from '../../content/toxicExposure';
import { isClaimingNew, showToxicExposurePages } from '../../utils/index';

export const toxicExposurePages = {
  toxicExposureConditions: {
    title: conditionsPageTitle,
    path: 'toxic-exposure-conditions',
    depends: () => isClaimingNew && showToxicExposurePages,
    uiSchema: toxicExposureConditions.uiSchema,
    schema: toxicExposureConditions.schema,
  },
  gulfWarHazard1990: {
    title: gulfWar1990PageTitle,
    path: 'gulf-war-hazard-1990',
    depends: () => isClaimingTECondition && showToxicExposurePages,
    uiSchema: gulfWarHazard1990.uiSchema,
    schema: gulfWarHazard1990.schema,
  },
};
