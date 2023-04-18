import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import { intersection, pick } from 'lodash';
import {
  preparerIdentificationFields,
  veteranDirectRelative,
} from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  preparerIdentificationFields.parentObject
];
const pageFields = [
  preparerIdentificationFields.preparerFullName,
  preparerIdentificationFields.preparerTitle,
  preparerIdentificationFields.preparerOrganization,
  preparerIdentificationFields.courtAppointmentInfo,
];
const isNotThirdParty = formData => {
  return veteranDirectRelative.includes(
    formData[preparerIdentificationFields.parentObject][
      preparerIdentificationFields.relationshipToVeteran
    ],
  );
};

export default {
  uiSchema: {
    [preparerIdentificationFields.parentObject]: {
      [preparerIdentificationFields.preparerFullName]: fullNameUI,
      [preparerIdentificationFields.preparerTitle]: {
        'ui:title': 'Title',
        'ui:options': {
          hideIf: isNotThirdParty,
        },
      },
      [preparerIdentificationFields.preparerOrganization]: {
        'ui:title': 'Organization',
        'ui:options': {
          hideIf: isNotThirdParty,
        },
      },
      [preparerIdentificationFields.courtAppointmentInfo]: {
        'ui:title':
          'If you represent a court appointment, you must include docket number, county, and State.',
        'ui:widget': 'textarea',
        'ui:options': {
          hideIf: isNotThirdParty,
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [preparerIdentificationFields.parentObject]: {
        type: 'object',
        required: intersection(required, pageFields),
        properties: pick(properties, pageFields),
      },
    },
  },
};
