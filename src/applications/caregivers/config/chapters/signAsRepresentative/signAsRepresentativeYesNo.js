// import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { representativeFields } from 'applications/caregivers/definitions/constants';

// const { representative } = fullSchema.properties;
// const veteranProps = veteran.properties;
// const { address, phone } = fullSchema.definitions;

const representativePage = {
  uiSchema: {
    [representativeFields.signAsRepresentative]: {
      'ui:title':
        "Would you like to upload documents to show that you're the Veteran's legal representative, you'll need to upload one fo these current documents:",
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          yes: "Yes, I'd like to upload documents now",
          noRep:
            'No, I am a legal representative but will upload documents later',
          no: 'No',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      [representativeFields.signAsRepresentative]: {
        type: 'string',
        enum: ['yes', 'noRep', 'no'],
      },
    },
  },
};

export default representativePage;
