import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import { intersection, pick } from 'lodash';
import environment from 'platform/utilities/environment';
import { getFullNameLabels } from 'applications/simple-forms/21-4142/helpers';
import {
  fullNameSchema,
  fullNameUI,
  textareaSchema,
  textareaUI,
  textSchema,
  textUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
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
  uiSchema: environment.isProduction()
    ? {
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
      }
    : {
        [preparerIdentificationFields.parentObject]: {
          ...titleUI('What is your full name?'),
          [preparerIdentificationFields.preparerFullName]: fullNameUI(label =>
            getFullNameLabels(label, true),
          ),
          [preparerIdentificationFields.preparerTitle]: textUI({
            title: 'Title',
            hideIf: isNotThirdParty,
            errorMessages: {
              required: 'Enter your title',
            },
            required: formData => isThirdParty(formData),
          }),
          [preparerIdentificationFields.preparerOrganization]: textUI({
            title: 'Organization',
            hideIf: isNotThirdParty,
            errorMessages: {
              required: 'Enter the name of the organization you represent',
            },
            required: formData => isThirdParty(formData),
          }),
          [preparerIdentificationFields.courtAppointmentInfo]: textareaUI({
            title:
              "If you represent a court appointment, you must include the docket number (or case number), county, and state. You can find the docket number on your case files, on the court's website, or by calling the court clerk",
            hideIf: isNotThirdParty,
          }),
        },
      },
  schema: {
    type: 'object',
    properties: environment.isProduction()
      ? {
          [preparerIdentificationFields.parentObject]: {
            type: 'object',
            required: intersection(required, pageFields),
            properties: pick(properties, pageFields),
          },
        }
      : {
          [preparerIdentificationFields.parentObject]: {
            type: 'object',
            properties: {
              [preparerIdentificationFields.preparerFullName]: fullNameSchema,
              [preparerIdentificationFields.preparerTitle]: textSchema,
              [preparerIdentificationFields.preparerOrganization]: textSchema,
              [preparerIdentificationFields.courtAppointmentInfo]: textareaSchema,
            },
          },
        },
  },
};
