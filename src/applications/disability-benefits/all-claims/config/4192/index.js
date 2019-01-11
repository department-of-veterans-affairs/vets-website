import environment from '../../../../../platform/utilities/environment';

import { pastEmploymentFormIntro } from '../../pages';

export default function() {
  let configObj = {};
  if (!environment.isProduction()) {
    configObj = {
      pastEmploymentFormIntro: {
        path: 'past-employment-walkthrough-choice',
        uiSchema: pastEmploymentFormIntro.uiSchema,
        schema: pastEmploymentFormIntro.schema,
      },
    };
  }
  return configObj;
}
