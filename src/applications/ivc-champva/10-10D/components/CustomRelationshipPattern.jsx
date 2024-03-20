import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

/**
 * Customized web component uiSchema for relationship to veteran
 * with support for more custom wording.
 *
 * set `labelHeaderLevel: ''` if you just want to use it as a standard field instead
 *
 * ```js
 * relationshipToVeteran: relationshipToVeteran() // 'Veteran'
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
 *   relativeTitle?: string,
 *   tense?: string,
 *   labelHeaderLevel?: UISchemaOptions['ui:options']['labelHeaderLevel'],
 *   customLabels?: object
 * }} options - a string representing the person type, or an object with options
 * @returns {UISchemaOptions}
 */

export const relationshipToVeteranUI = options => {
  const { personTitle, relativeTitle, tense, labelHeaderLevel, customLabels } =
    typeof options === 'object' ? options : { personTitle: options };

  const person = personTitle ?? 'Veteran';

  const isRelativeFn = typeof relativeTitle === 'function';
  const relativeTitleVal = isRelativeFn
    ? props => relativeTitle(props)
    : relativeTitle;

  const conjugatedVerbThirdPerson = tense === 'past' ? 'was' : 'is';
  const conjugatedVerbFirstPerson = tense === 'past' ? 'I was' : 'I’m';

  let relativeBeingVerb = conjugatedVerbFirstPerson;
  if (relativeTitleVal) {
    relativeBeingVerb = `${relativeTitleVal} ${conjugatedVerbThirdPerson}`;
  }

  const relativePossessive = `${`${
    relativeTitleVal ? `${relativeTitleVal}’s` : 'your'
  }`}`;

  return {
    relationshipToVeteran: radioUI({
      title: `What’s ${relativePossessive} relationship to the ${person}?`,
      labels: customLabels || {
        spouse: `${relativeBeingVerb} the ${person}’s spouse`,
        child: `${relativeBeingVerb} the ${person}’s child`,
        caretaker: `${relativeBeingVerb} the ${person}’s caretaker`,
        other: `${
          relativeTitleVal ? `${relativeTitleVal} doesn’t` : 'We don’t'
        } have a relationship that’s listed here`,
      },
      errorMessages: {
        required: `Please enter ${relativePossessive} relationship to the ${person}`,
      },
      labelHeaderLevel: labelHeaderLevel ?? '3',
    }),
    otherRelationshipToVeteran: {
      'ui:title': `Since ${relativePossessive} relationship with the ${person} was not listed, please describe it here`,
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'relationshipToVeteran',
        expandUnderCondition: 'other',
        expandedContentFocus: true,
      },
      'ui:errorMessages': {
        required: `Please enter ${relativePossessive} relationship to the ${person}`,
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

export const relationshipToVeteranSchema = {
  type: 'object',
  properties: {
    relationshipToVeteran: radioSchema([
      'spouse',
      'child',
      'caretaker',
      'other',
    ]),
    otherRelationshipToVeteran: {
      type: 'string',
    },
  },
  required: ['relationshipToVeteran'],
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
