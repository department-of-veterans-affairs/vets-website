import { titleUI } from '~/platform/forms-system/src/js/web-component-patterns';
import content from '../locales/en/content.json';

export const spouseInformationIntroPage = {
  uiSchema: {
    ...titleUI(
      content['household-spouse-intro-title'],
      content['household-spouse-intro-description'],
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
