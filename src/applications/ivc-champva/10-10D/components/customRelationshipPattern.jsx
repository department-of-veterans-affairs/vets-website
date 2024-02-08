import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

/**
 * Web component uiSchema for relationship to veteran
 *
 * Pattern recommendation: Use as a standalone on the page
 *
 * set `labelHeaderLevel: ''` if you just want to use it as a standard field instead
 *
 * ```js
 * relationshipToVeteran: relationshipToVeteran() // 'Veteran'
 * relationshipAsField: relationshipToVeteran({
 *  personTitle: 'claimant',
 *  labelHeaderLevel: ''
 * })
 * ```
 *
 * @param {string | {
 *   personTitle?: string,
 *   relativeTitle?: string,
 *   tense?: string,
 *   labelHeaderLevel?: UISchemaOptions['ui:options']['labelHeaderLevel'],
 * }} options - a string representing the person type, or an object with options
 * @returns {UISchemaOptions}
 */

export const relationshipToVeteranUI = options => {
  const { personTitle, relativeTitle, tense, labelHeaderLevel } =
    typeof options === 'object' ? options : { personTitle: options };

  const person = personTitle ?? 'Veteran';

  const isRelativeFn = typeof relativeTitle === 'function';
  const relativeTitleVal = isRelativeFn
    ? props => relativeTitle(props)
    : relativeTitle;

  const conjugatedVerbThirdPerson = tense && tense === 'past' ? 'was' : 'is';
  const conjugatedVerbFirstPerson = tense && tense === 'past' ? 'I was' : 'I’m';

  const relativeBeingVerb = `${`${
    relativeTitleVal
      ? `${relativeTitleVal} ${conjugatedVerbThirdPerson}`
      : conjugatedVerbFirstPerson
  }`}`;

  const relativePossessive = `${`${
    relativeTitleVal ? `${relativeTitleVal}’s` : 'your'
  }`}`;

  return {
    relationshipToVeteran: radioUI({
      title: `What’s ${relativePossessive} relationship to the ${person}?`,
      labels: {
        spouse: `${relativeBeingVerb} the ${person}’s spouse`,
        child: `${relativeBeingVerb} the ${person}’s child`,
        caretaker: `${relativeBeingVerb} the ${person}’s caretaker`,
        other: `${`${
          relativeTitleVal ? `${relativeTitleVal} doesn’t` : 'We don’t'
        }`} have a relationship that’s listed here`,
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
