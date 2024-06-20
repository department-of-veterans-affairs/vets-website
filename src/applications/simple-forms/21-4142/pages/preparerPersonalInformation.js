import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import { intersection, pick } from 'lodash';
import { fullNameDeprecatedUI } from '../../shared/definitions/rjsfPatterns';
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
const isThirdParty = formData => !isNotThirdParty(formData);

/** @type {PageSchema} */
export default {
  uiSchema: {
    [preparerIdentificationFields.parentObject]: {
      [preparerIdentificationFields.preparerFullName]: fullNameDeprecatedUI,
      [preparerIdentificationFields.preparerTitle]: {
        'ui:title': 'Title',
        'ui:options': {
          hideIf: isNotThirdParty,
        },
        'ui:errorMessages': {
          required: 'Enter your title',
        },
        'ui:required': formData => isThirdParty(formData),
      },
      [preparerIdentificationFields.preparerOrganization]: {
        'ui:title': 'Organization',
        'ui:options': {
          hideIf: isNotThirdParty,
        },
        'ui:errorMessages': {
          required: 'Enter the name of the organization you represent',
        },
        'ui:required': formData => isThirdParty(formData),
      },
      [preparerIdentificationFields.courtAppointmentInfo]: {
        'ui:title':
          "If you represent a court appointment, you must include the docket number (or case number), county, and state. You can find the docket number on your case files, on the court's website, or by calling the court clerk",
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
