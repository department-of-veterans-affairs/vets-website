import {
  textareaUI,
  textareaSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  LISTED_BEHAVIOR_TYPES_WITH_SECTION,
  MH_0781_URL_PREFIX,
  ALL_BEHAVIOR_CHANGE_DESCRIPTIONS,
} from '../../constants';
import { showBehaviorDescriptionsPage } from '../../utils/form0781';
import {
  behaviorDescriptionPageDescription,
  behaviorDescriptionPageHint,
} from '../../content/form0781/behaviorListPages';
import {
  titleWithTag,
  form0781HeadingTag,
  mentalHealthSupportAlert,
} from '../../content/form0781';

/**
 * Make the uiSchema for a description page for each behavior type
 * @param {string} behaviorType
 * @returns {object} uiSchema object
 */
function makeUiSchema(behaviorType) {
  return {
    'ui:title': titleWithTag(
      ALL_BEHAVIOR_CHANGE_DESCRIPTIONS[behaviorType],
      form0781HeadingTag,
    ),
    behaviorsDetails: {
      [behaviorType]: textareaUI({
        title: behaviorDescriptionPageDescription,
        hint: behaviorDescriptionPageHint,
      }),
    },
    'view:mentalHealthSupportAlert': {
      'ui:description': mentalHealthSupportAlert,
    },
  };
}

/**
 * Make the uiSchema for a description page for each behavior type
 * @param {string} behaviorType
 * @returns {object} - schema object
 */

function makeSchema(behaviorType) {
  return {
    type: 'object',
    properties: {
      behaviorsDetails: {
        type: 'object',
        properties: {
          [behaviorType]: textareaSchema,
        },
      },
      'view:mentalHealthSupportAlert': {
        type: 'object',
        properties: {},
      },
    },
  };
}

/**
 * Make all the page configurations for each behavior description page. Example
 * {
 *  'reassignmentDescriptionPage': {
 *    title: 'Reassignment,
 *    path: 'mental-health-form-0781/behavior-changes-1-description',
 *    uiSchema: [Object],
 *    schema: [Object],
 *    depends: [Function: depends]
 *  },
 *  'absencesDescriptionPage': {
 *    ... // continue for the rest of the listed behavior types
 *  }
 * }
 *
 * @returns an object with a page object for each behavior description page
 */
export function makePages() {
  const behaviorChangeTypesList = Object.entries(
    LISTED_BEHAVIOR_TYPES_WITH_SECTION,
  ).map(([behaviorType, behaviorSection], index) => {
    const pageName = `behavior-changes-${index + 1}-description`;
    return {
      [pageName]: {
        title: ALL_BEHAVIOR_CHANGE_DESCRIPTIONS[behaviorType],
        path: `${MH_0781_URL_PREFIX}/${pageName}`,
        uiSchema: makeUiSchema(behaviorType),
        schema: makeSchema(behaviorType),
        depends: formData =>
          showBehaviorDescriptionsPage(formData, behaviorSection, behaviorType),
      },
    };
  });

  return Object.assign({}, ...behaviorChangeTypesList);
}
