import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    thirdPartyPreparerRole: radioUI({
      title: 'Which of these best describes you?',
      labels: {
        fiduciary: 'I’m a fiduciary',
        officer: 'I’m a Veteran service officer',
        alternate: 'I’m an alternate signer',
        other: 'My role isn’t listed here',
      },
      errorMessages: {
        required: 'Select your applicable role',
      },
      labelHeaderLevel: '3',
    }),
    otherThirdPartyPreparerRole: {
      'ui:title':
        'Since your representing role isn’t listed, please describe it here',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'thirdPartyPreparerRole',
        expandUnderCondition: 'other',
        expandedContentFocus: true,
      },
      'ui:errorMessages': {
        required: 'Describe your role',
      },
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        if (formSchema.properties.otherThirdPartyPreparerRole['ui:collapsed']) {
          return { ...formSchema, required: ['thirdPartyPreparerRole'] };
        }

        return {
          ...formSchema,
          required: ['thirdPartyPreparerRole', 'otherThirdPartyPreparerRole'],
        };
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      thirdPartyPreparerRole: radioSchema([
        'fiduciary',
        'officer',
        'alternate',
        'other',
      ]),
      otherThirdPartyPreparerRole: {
        type: 'string',
      },
    },
    required: ['relationshipToVeteran'],
  },
};
