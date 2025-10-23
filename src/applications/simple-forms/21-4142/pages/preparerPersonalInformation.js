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
import {
  preparerIdentificationFields,
  veteranDirectRelative,
} from '../definitions/constants';

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
    properties: {
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
