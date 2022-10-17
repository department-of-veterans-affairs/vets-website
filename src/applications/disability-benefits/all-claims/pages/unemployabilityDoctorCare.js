import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import {
  unemployabilityTitle,
  unemployabilityPageTitle,
} from '../content/unemployabilityFormIntro';
import UnemployabilityDoctorCareField from '../components/UnemployabilityDoctorCareField';
import {
  doctorDatesDecription,
  doctorCareDescription,
  privateMedicalFacilityDescription,
} from '../content/unemployabilityDoctorCare';
import { addressUISchema } from '../utils/schemas';

const {
  doctorProvidedCare,
} = fullSchema.properties.form8940.properties.unemployability.properties;

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  unemployability: {
    'ui:title': unemployabilityPageTitle('Doctor’s care'),
    'ui:description': doctorCareDescription,
    doctorProvidedCare: {
      'ui:options': {
        viewField: UnemployabilityDoctorCareField,
        itemName: 'Doctor',
      },
      items: {
        name: {
          'ui:title': 'Doctor’s name',
        },
        address: addressUISchema(
          'unemployability.doctorProvidedCare[:index].address',
          null,
          false,
          false,
        ),
        dates: {
          'ui:title': doctorDatesDecription,
          'ui:widget': 'textarea',
          'ui:options': {
            rows: 5,
            maxLength: 32000,
          },
        },
      },
    },
  },
  'view:privateMedicalFacility': {
    'ui:title': ' ',
    'ui:description': privateMedicalFacilityDescription,
  },
};

export const schema = {
  type: 'object',
  properties: {
    unemployability: {
      type: 'object',
      properties: {
        doctorProvidedCare,
      },
    },
    'view:privateMedicalFacility': {
      type: 'object',
      properties: {},
    },
  },
};
