import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';
import createApplicantInformationPage from 'platform/forms/pages/applicantInformation';

export const applicantInformationField = () => {
  return {
    ...createApplicantInformationPage(fullSchema10282, {
      fields: ['veteranFullName'],
    }),
  };
};
