import { radioUI, radioSchema } from './radioPattern';
import VaTextInputField from '../web-component-fields/VaTextInputField';

/**
 * Web component uiSchema for relationship to veteran
 *
 * Pattern recommendation: Use as a standalone on the page
 *
 * set `labelHeaderLevel: ''` if you just want to use it as a standard field instead
 *
 * ```js
 * relationshipToVeteran: relationshipToVeteran() // 'Veteran'
 * relationshipToClaimant: relationshipToVeteran('claimant')
 * relationshipAsField: relationshipToVeteran({
 *  personTitle: 'claimant',
 *  labelHeaderLevel: ''
 * })
 * customRelationshipToVeteran: relationshipToVeteranUI({
 *   customLabels: {
 *     caretaker: "I’m the Veteran’s caretaker"
 *   }
 * })
 * ```
 *
 * @param {string | {
 *   personTitle?: string,
 *   labelHeaderLevel?: UISchemaOptions['ui:options']['labelHeaderLevel'],
 *   customLabels?: object
 * }} options - a string representing the person type, or an object with options
 * @returns {UISchemaOptions}
 */

export const relationshipToVeteranUI = options => {
  const { personTitle, labelHeaderLevel, customLabels } =
    typeof options === 'object' ? options : { personTitle: options };
  const person = personTitle ?? 'Veteran';

  return {
    relationshipToVeteran: radioUI({
      title: `What’s your relationship to the ${person}?`,
      labels: customLabels || {
        spouse: `I’m the ${person}’s spouse`,
        child: `I’m the ${person}’s child`,
        parent: `I’m the ${person}’s parent`,
        executor: `I’m the ${person}’s executor or administrator of estate`,
        other: 'We don’t have a relationship that’s listed here',
      },
      errorMessages: {
        required: `Please select your relationship to the ${person}`,
      },
      labelHeaderLevel: labelHeaderLevel ?? '3',
    }),
    otherRelationshipToVeteran: {
      'ui:title': `Since your relationship with the ${person} was not listed, please describe it here`,
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'relationshipToVeteran',
        expandUnderCondition: 'other',
        expandedContentFocus: true,
      },
      'ui:errorMessages': {
        required: `Please enter your relationship to the ${person}`,
      },
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        if (formSchema.properties.otherRelationshipToVeteran['ui:collapsed']) {
          return { ...formSchema, required: ['relationshipToVeteran'] };
        }
        return {
          ...formSchema,
          required: ['relationshipToVeteran', 'otherRelationshipToVeteran'],
        };
      },
    },
  };
};

export const relationshipToVeteranSpouseOrChildUI = personTitle => {
  const person = personTitle ?? 'Veteran';

  return {
    relationshipToVeteran: radioUI({
      title: `What’s your relationship to the ${person}?`,
      labels: {
        spouse: `I’m the ${person}’s spouse`,
        child: `I’m the ${person}’s child`,
      },
      errorMessages: {
        required: `Select your relationship to the ${person}`,
      },
      labelHeaderLevel: '3',
    }),
  };
};

export const claimantRelationshipToVeteranSpouseOrChildUI = personTitle => {
  const person = personTitle ?? 'Veteran';

  return {
    relationshipToVeteran: radioUI({
      title: `What’s the claimant’s relationship to the ${person}?`,
      labels: {
        spouse: `The claimant is the ${person}’s spouse`,
        child: `The claimant is the ${person}’s child`,
      },
      errorMessages: {
        required: `Select the claimant’s relationship to the ${person}`,
      },
      labelHeaderLevel: '3',
    }),
  };
};

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

export const relationshipToVeteranSchema = {
  type: 'object',
  properties: {
    relationshipToVeteran: radioSchema([
      'spouse',
      'child',
      'parent',
      'executor',
      'other',
    ]),
    otherRelationshipToVeteran: {
      type: 'string',
    },
  },
  required: ['relationshipToVeteran'],
};

export const relationshipToVeteranSpouseOrChildSchema = {
  type: 'object',
  properties: {
    relationshipToVeteran: radioSchema(['spouse', 'child']),
  },
  required: ['relationshipToVeteran'],
};
