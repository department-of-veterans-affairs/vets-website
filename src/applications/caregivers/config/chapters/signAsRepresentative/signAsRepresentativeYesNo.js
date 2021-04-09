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
        "Do you have a legal representative documents you'd like to share with us?",
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          yes: 'Yes. I want to upload my document now.',
          noRep: "Yes. But I'll provide my document later.",
          no: "No. I don't have this document",
        },
      },
    },
    'view:placeholderOne': {
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
      'view:placeholderOne': {
        type: 'object',
        properties: {},
      },
    },
  },
};

export default representativePage;
