import { radioSchema } from 'platform/forms-system/src/js/web-component-patterns';

/**
 * Schema that takes a list of label keys, to be used in
 * conjunction with customLabels property of relationshipToVeteranUI.
 *
 * This provides a way to have customized labels while still
 * optionally taking advantage of the dropdown "other" behavior without
 * reinventing the wheel.
 *
 * ```js
 * relationshipToVeteran: customRelationshipSchema([
 *  'spouse',
 *  'caretaker',
 *  'other',     // Include if you want the functionality
 * ]),
 * ```
 * @param {array} labels array of strings that correspond to label keys
 *   provided to relationshipToVeteranUI
 * @returns {object}
 */
export const customRelationshipSchema = labels => {
  return {
    type: 'object',
    properties: {
      relationshipToVeteran: radioSchema([...labels]),
      otherRelationshipToVeteran: { type: 'string' },
    },
  };
};
