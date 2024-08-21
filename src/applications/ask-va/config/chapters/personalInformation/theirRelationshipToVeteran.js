import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CHAPTER_3, aboutTheirRelationshipToVet } from '../../../constants';

const theirRelationshipToVeteranPage = {
  uiSchema: {
    theirRelationshipToVeteran: radioUI({
      title: CHAPTER_3.THEIR_RELATIONSHIP_TO_VET.TITLE,
      labelHeaderLevel: '3',
      labels: aboutTheirRelationshipToVet,
      errorMessages: {
        required: 'Please select your relationship to the family member',
      },
      required: () => true,
    }),
    theyHaveRelationshipNotListed: {
      'ui:title': CHAPTER_3.THEIR_RELATIONSHIP_TO_VET.QUESTION_1,
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'theirRelationshipToVeteran',
        expandUnderCondition: 'NOT_LISTED',
        expandedContentFocus: true,
      },
      'ui:errorMessages': {
        required: `Please enter your relationship to the family member`,
      },
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        if (
          formSchema.properties.theyHaveRelationshipNotListed['ui:collapsed']
        ) {
          return {
            ...formSchema,
            required: ['theirRelationshipToVeteran'],
          };
        }
        return {
          ...formSchema,
          required: [
            'theirRelationshipToVeteran',
            'theyHaveRelationshipNotListed',
          ],
        };
      },
    },
  },
  schema: {
    type: 'object',
    required: ['theirRelationshipToVeteran'],
    properties: {
      theirRelationshipToVeteran: radioSchema(
        Object.values(aboutTheirRelationshipToVet),
      ),
      theyHaveRelationshipNotListed: { type: 'string' },
    },
  },
};

export default theirRelationshipToVeteranPage;
