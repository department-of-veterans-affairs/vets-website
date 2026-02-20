import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CHAPTER_3, aboutFamilyMemberRelationship } from '../../../constants';

const aboutYourRelationshipToFamilyMemberPage = {
  uiSchema: {
    aboutYourRelationshipToFamilyMember: radioUI({
      title: CHAPTER_3.RELATIONSHIP_TO_FAM_MEM.TITLE,
      labelHeaderLevel: '3',
      labels: aboutFamilyMemberRelationship,
      errorMessages: {
        required: 'Select your relationship to the family member',
      },
      required: () => true,
    }),
    relationshipNotListed: {
      'ui:title': `Describe your relationship to the family member`,
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'aboutYourRelationshipToFamilyMember',
        expandUnderCondition: 'NOT_LISTED',
        expandedContentFocus: true,
      },
      'ui:errorMessages': {
        required: `Enter your relationship to the family member`,
      },
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        if (formSchema.properties.relationshipNotListed['ui:collapsed']) {
          return {
            ...formSchema,
            required: ['aboutYourRelationshipToFamilyMember'],
          };
        }
        return {
          ...formSchema,
          required: [
            'aboutYourRelationshipToFamilyMember',
            'relationshipNotListed',
          ],
        };
      },
    },
  },
  schema: {
    type: 'object',
    required: ['aboutYourRelationshipToFamilyMember'],
    properties: {
      aboutYourRelationshipToFamilyMember: radioSchema(
        Object.values(aboutFamilyMemberRelationship),
      ),
      relationshipNotListed: { type: 'string' },
    },
  },
};

export default aboutYourRelationshipToFamilyMemberPage;
