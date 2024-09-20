import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';
import createApplicantInformationPage from 'platform/forms/pages/applicantInformation';

const uiSchema = {
  'ui:description':
    "The next few questions are about race, gender, education, and employment. These questions are optional. You don't need to answer them. We ask these questions for statistical purposes. Your answers won't affect your eligibility for the IBM SkillsBuild program.",
  raceAndGender: {
    'ui:title': 'Do you want to answer the optional questions?',
    'ui:widget': 'radio',
  },
};
const genderRaceQuestionField = () => {
  return {
    ...createApplicantInformationPage(fullSchema10282, {
      isVeteran: true,
      fields: ['raceAndGender'],
    }),
    uiSchema,
  };
};
export { uiSchema, genderRaceQuestionField };
