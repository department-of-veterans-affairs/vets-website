import environment from '../../../../../platform/utilities/environment';

import { pastEmploymentFormIntro, instructionalPart1 } from '../../pages';

import { needsToEnterUnemployability } from '../../utils';

export default function() {
  let configObj = {};
  if (!environment.isProduction()) {
    configObj = {
      pastEmploymentFormIntro: {
        path: 'past-employment-walkthrough-choice',
        uiSchema: pastEmploymentFormIntro.uiSchema,
        schema: pastEmploymentFormIntro.schema,
      },
      instructionalPart1: {
        path: '4192-instructions-part-1',
        uiSchema: instructionalPart1.uiSchema,
        schema: instructionalPart1.schema,
      },
      conclusion4192: {
        title: 'Conclusion 4192',
        path: 'disabilities/conclusion-4192',
        depends: needsToEnterUnemployability,
        uiSchema: {
          'ui:title': ' ',
          'ui:description':
            'Thank you for taking the time to answer our questions. The information you provided will help us process your claim.',
        },
        schema: {
          type: 'object',
          properties: {},
        },
      },
    };
  }
  return configObj;
}
