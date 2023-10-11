import { toxicExposureConfirm, toxicExposureIntro } from '..';
import { showToxicExposurePages } from '../../utils/index';

export const toxicExposurePages = {
  toxicExposureIntro: {
    title: 'Toxic Exposure',
    path: 'toxic-exposure-intro',
    depends: () => showToxicExposurePages,
    uiSchema: toxicExposureIntro.uiSchema,
    schema: toxicExposureIntro.schema,
  },
  toxicExposureConfirm: {
    title: 'Toxic Exposure Confirmation',
    path: 'toxic-exposure-confirm',
    depends: formData =>
      showToxicExposurePages &&
      ['no', 'notSure'].includes(formData['view:exposureStatus']),
    uiSchema: toxicExposureConfirm.uiSchema,
    schema: toxicExposureConfirm.schema,
  },
};
