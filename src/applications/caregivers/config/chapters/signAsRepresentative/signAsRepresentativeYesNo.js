// import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { representativeFields } from 'applications/caregivers/definitions/constants';
import {
  RepresentativeIntroContent,
  RepresentativeAdditionalInfo,
} from 'applications/caregivers/components/AdditionalInfo';

// const { representative } = fullSchema.properties;
// const veteranProps = veteran.properties;
// const { address, phone } = fullSchema.definitions;

const representativePage = {
  uiSchema: {
    'ui:description': RepresentativeIntroContent(),
    [representativeFields.signAsRepresentativeYesNo]: {
      'ui:title':
        "Do you have legal representative documents you'd like to share with us?",
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          yes: 'Yes. I want to upload my documents now',
          noRep: "Yes. But I'll provide my documents later",
          no: "No. I don't have these documents.",
        },
      },
    },
    'view:placeholder': {
      'ui:description': RepresentativeAdditionalInfo(),
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      [representativeFields.signAsRepresentativeYesNo]: {
        type: 'string',
        enum: ['yes', 'noRep', 'no'],
      },
      'view:placeholder': {
        type: 'object',
        properties: {},
      },
    },
  },
};

export default representativePage;
