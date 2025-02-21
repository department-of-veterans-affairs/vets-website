import {
  textareaUI,
  textareaSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  BEHAVIOR_CHANGE_TYPES_WITH_SECTION,
  MH_0781_URL_PREFIX,
  ALL_BEHAVIOR_CHANGE_DESCRIPTIONS,
} from '../../constants';
import { showBehaviorDescriptionsPage } from '../../utils/form0781';
import { behaviorDescriptionPageDescription } from '../../content/form0781/behaviorListPages';
import {
  titleWithTag,
  form0781HeadingTag,
  mentalHealthSupportAlert,
} from '../../content/form0781';

/**
 * Make the uiSchema for a description page for each behavior type
 * @param {string} behavior - behavior type
 * @returns {object} uiSchema object
 */
function makeUiSchema(behavior) {
  return {
    'ui:title': titleWithTag(
      ALL_BEHAVIOR_CHANGE_DESCRIPTIONS[behavior],
      form0781HeadingTag,
    ),
    behaviorsDetails: {
      [behavior]: textareaUI({
        title: behaviorDescriptionPageDescription,
      }),
    },
    'view:mentalHealthSupportAlert': {
      'ui:description': mentalHealthSupportAlert,
    },
  };
}

/**
 * Make the uiSchema for a description page for each behavior type
 * @param {string} behavior - behavior type
 * @returns {object} - schema object
 */

function makeSchema(behavior) {
  return {
    type: 'object',
    properties: {
      behaviorsDetails: {
        type: 'object',
        properties: {
          [behavior]: textareaSchema,
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
 * Make all the page configurations for each behavior description pages. Example
 * {
 *  'reassignmentDescriptionPage': {
 *    title: 'Reassignment,
 *    path: 'mental-health-form-0781/behavior-changes-1-description',
 *    uiSchema: [Object],
 *    schema: [Object],
 *    depends: [Function: depends]
 *  },
 *  'absencesDescriptionPage': {
 *    ... // continue for the rest of the 13 behaviors
 *  }
 * }
 *
 * @returns an object with a page object for each details page
 */
export function makePages() {
  const behaviorChangeTypesList = Object.entries(
    BEHAVIOR_CHANGE_TYPES_WITH_SECTION,
  )
    .filter(([behavior]) => behavior !== 'unlisted')
    .map(([behavior, section], index) => {
      const pageName = `behavior-changes-${index + 1}-description`;
      return {
        [pageName]: {
          title: ALL_BEHAVIOR_CHANGE_DESCRIPTIONS[behavior],
          path: `${MH_0781_URL_PREFIX}/${pageName}`,
          uiSchema: makeUiSchema(behavior),
          schema: makeSchema(behavior),
          depends: formData =>
            showBehaviorDescriptionsPage(formData, behavior, section),
        },
      };
    });

  return Object.assign({}, ...behaviorChangeTypesList);
}
