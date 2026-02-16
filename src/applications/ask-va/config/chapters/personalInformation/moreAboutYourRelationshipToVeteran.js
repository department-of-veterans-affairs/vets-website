import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CHAPTER_3, aboutRelationship } from '../../../constants';

const moreAboutYourRelationshipToVeteranPage = {
  uiSchema: {
    moreAboutYourRelationshipToVeteran: radioUI({
      title: CHAPTER_3.MORE_ABOUT_YOUR_RELATIONSHIP_TO_VETERAN.TITLE,
      labelHeaderLevel: '3',
      labels: aboutRelationship,
      errorMessages: {
        required: 'Select your relationship to the Veteran',
      },
      required: () => true,
    }),
    relationshipNotListed: {
      'ui:title': `Describe your relationship to the Veteran`,
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'moreAboutYourRelationshipToVeteran',
        expandUnderCondition: 'NOT_LISTED',
        expandedContentFocus: true,
      },
      'ui:errorMessages': {
        required: `Enter your relationship to the Veteran`,
      },
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        if (formSchema.properties.relationshipNotListed['ui:collapsed']) {
          return {
            ...formSchema,
            required: ['moreAboutYourRelationshipToVeteran'],
          };
        }
        return {
          ...formSchema,
          required: [
            'moreAboutYourRelationshipToVeteran',
            'relationshipNotListed',
          ],
        };
      },
    },
  },
  schema: {
    type: 'object',
    required: ['moreAboutYourRelationshipToVeteran'],
    properties: {
      moreAboutYourRelationshipToVeteran: radioSchema(
        Object.values(aboutRelationship),
      ),
      relationshipNotListed: { type: 'string' },
    },
  },
};

export default moreAboutYourRelationshipToVeteranPage;
