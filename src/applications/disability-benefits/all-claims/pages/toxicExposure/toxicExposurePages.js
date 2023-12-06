import { toxicExposureIntro } from '..';
import { showToxicExposurePages } from '../../utils/index';

export const toxicExposurePages = {
  toxicExposureIntro: {
    title: 'Toxic Exposure',
    path: 'toxic-exposure',
    depends: () => showToxicExposurePages,
    uiSchema: toxicExposureIntro.uiSchema,
    schema: toxicExposureIntro.schema,
  },
};
