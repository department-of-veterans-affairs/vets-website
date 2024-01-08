import { toxicExposureConditions } from '..';
import { isClaimingNew, showToxicExposurePages } from '../../utils/index';

export const toxicExposurePages = {
  toxicExposureConditions: {
    title: 'Toxic Exposure',
    path: 'toxic-exposure-conditions',
    depends: () => isClaimingNew && showToxicExposurePages,
    uiSchema: toxicExposureConditions.uiSchema,
    schema: toxicExposureConditions.schema,
  },
};
