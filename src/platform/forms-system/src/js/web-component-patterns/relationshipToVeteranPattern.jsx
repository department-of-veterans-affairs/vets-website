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
 * ```
 *
 * @param {string | {
 *   personTitle?: string,
 *   relativeTitle?: string,
 *   labelHeaderLevel?: UISchemaOptions['ui:options']['labelHeaderLevel'],
 * }} options - a string representing the person type, or an object with options
 * @returns {UISchemaOptions}
 */

export const relationshipToVeteranUI = options => {
  const { personTitle, relativeTitle, labelHeaderLevel } =
    typeof options === 'object' ? options : { personTitle: options };
  const person = personTitle ?? 'Veteran';

  const relativeBeingVerb = `${`${
    relativeTitle ? `${relativeTitle} is` : 'I’m'
  }`}`;
  const relativePossessive = `${`${
    relativeTitle ? `${relativeTitle}’s` : 'your'
  }`}`;

  return {
    relationshipToVeteran: radioUI({
      title: `What’s ${relativePossessive} relationship to the ${person}?`,
      labels: {
        spouse: `${relativeBeingVerb} the ${person}’s spouse`,
        child: `${relativeBeingVerb} the ${person}’s child`,
        parent: `${relativeBeingVerb} the ${person}’s parent`,
        executor: `${relativeBeingVerb} the ${person}’s executor or administrator of estate`,
        other: `${`${
          relativeTitle ? `${relativeTitle} doesn’t` : 'We don’t'
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
