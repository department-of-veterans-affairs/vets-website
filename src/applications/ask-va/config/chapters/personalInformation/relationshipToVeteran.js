import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import PageFieldSummary from '../../../components/PageFieldSummary';
import {
  CHAPTER_3,
  relationshipOptionsMyself,
  relationshipOptionsSomeoneElse,
} from '../../../constants';

const relationshipToVeteranPage = {
  uiSchema: {
    'ui:objectViewField': PageFieldSummary,
    personalRelationship: radioUI({
      title: CHAPTER_3.RELATIONSHIP_TO_VET.TITLE,
      labelHeaderLevel: '3',
      labels: relationshipOptionsSomeoneElse,
      required: () => true,
    }),
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        if (formData.questionAbout === 'Myself') {
          return {
            ...formSchema,
            properties: {
              personalRelationship: radioSchema(
                Object.values(relationshipOptionsMyself),
              ),
            },
          };
        }
        return {
          ...formSchema,
          properties: {
            personalRelationship: radioSchema(
              Object.values(relationshipOptionsSomeoneElse),
            ),
          },
        };
      },
    },
  },
  schema: {
    type: 'object',
    required: ['personalRelationship'],
    properties: {
      personalRelationship: radioSchema(
        Object.values(relationshipOptionsSomeoneElse),
      ),
    },
  },
};

export default relationshipToVeteranPage;
