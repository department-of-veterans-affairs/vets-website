import createApplicantInformationPage from 'platform/forms/pages/applicantInformation';
import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';

const applicantInformation = createApplicantInformationPage(fullSchema1995, {
  isVeteran: true,
  fields: [
    'veteranFullName',
    'veteranSocialSecurityNumber',
    'view:noSSN',
    'vaFileNumber',
  ],
  required: ['veteranFullName'],
});

export const path = applicantInformation.path;
export const title = applicantInformation.title;

export const uiSchema = {
  ...applicantInformation.uiSchema,
  veteranFullName: {
    ...applicantInformation.uiSchema.veteranFullName,
    first: {
      ...applicantInformation.uiSchema.veteranFullName.firstName,
      'ui:title': 'Your first name',
    },
    last: {
      ...applicantInformation.uiSchema.veteranFullName.firstName,
      'ui:title': 'Your last name',
    },
    middle: {
      ...applicantInformation.uiSchema.veteranFullName.firstName,
      'ui:title': 'Your middle name',
    },
  },
};

export const schema = { ...applicantInformation.schema };
