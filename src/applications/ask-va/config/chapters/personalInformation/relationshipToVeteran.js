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
    relationshipToVeteran: radioUI({
      title: CHAPTER_3.RELATIONSHIP_TO_VET.TITLE,
      labelHeaderLevel: '3',
      labels: relationshipOptionsSomeoneElse,
      required: () => true,
      errorMessages: {
        required: 'Select your relationship to the Veteran.',
      },
    }),
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        if (formData.whoIsYourQuestionAbout === 'Myself') {
          return {
            ...formSchema,
            properties: {
              relationshipToVeteran: radioSchema(
                Object.values(relationshipOptionsMyself),
              ),
            },
          };
        }
        return {
          ...formSchema,
          properties: {
            relationshipToVeteran: radioSchema(
              Object.values(relationshipOptionsSomeoneElse),
            ),
          },
        };
      },
    },
  },
  schema: {
    type: 'object',
    required: ['relationshipToVeteran'],
    properties: {
      relationshipToVeteran: radioSchema(
        Object.values(relationshipOptionsSomeoneElse),
      ),
    },
  },
};

export default relationshipToVeteranPage;
