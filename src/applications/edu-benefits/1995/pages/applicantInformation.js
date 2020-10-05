import createApplicantInformationPage from 'platform/forms/pages/applicantInformation';
import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';

export const page = createApplicantInformationPage(fullSchema1995, {
  isVeteran: true,
  fields: [
    'veteranFullName',
    'veteranSocialSecurityNumber',
    'view:noSSN',
    'vaFileNumber',
  ],
  required: ['veteranFullName'],
});
