import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';
import createApplicantInformationPage from 'platform/forms/pages/applicantInformation';

const uiSchema = {
  ethnicity: {
    'ui:title': 'What is your ethnicity?',
    'ui:widget': 'radio',
  },
};

const applicanteEthnicityAndRaceFiled = () => {
  return {
    ...createApplicantInformationPage(fullSchema10282, {
      isVeteran: true,
      fields: ['ethnicity'],
    }),
    uiSchema,
  };
};

export { uiSchema, applicanteEthnicityAndRaceFiled };
