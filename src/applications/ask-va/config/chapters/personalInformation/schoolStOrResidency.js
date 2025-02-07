import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { CHAPTER_3 } from '../../../constants';

const schoolStOrResidencyPage = {
  uiSchema: {
    stateOrResidency: {
      ...titleUI(CHAPTER_3.SCHOOL_STATE_OR_RESIDENCY.TITLE),
      schoolState: {
        'ui:title': 'School state',
      },
      residencyState: {
        'ui:title': 'Residency state',
      },
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      stateOrResidency: {
        type: 'object',
        properties: {
          schoolState: {
            type: 'string',
          },
          residencyState: {
            type: 'string',
          },
        },
      },
    },
  },
};

export default schoolStOrResidencyPage;
