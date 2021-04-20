import { veteranInformation } from '../schema-imports';

export const schema = {
  veteranInformation,
};

export const uiSchema = {
  veteranInformation: {
    'ui:description':
      "Please provide the Veteran's name. We'll keep this information in our records. If we need more information, we'll contact you.",
    veteranFirstName: {
      'ui:title': "Veteran's first name",
      'ui:errorMessages': {
        required: "Please enter the Veteran's first name.",
      },
    },
    veteranLastName: {
      'ui:title': "Veteran's last name",
      'ui:errorMessages': {
        required: "Please enter the Veteran's last name.",
      },
    },
  },
};
