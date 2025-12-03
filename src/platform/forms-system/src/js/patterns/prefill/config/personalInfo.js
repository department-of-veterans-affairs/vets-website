import { personalInformationPage } from '../PersonalInformation';

export const personalInfo = {
  ...personalInformationPage({
    personalInfoConfig: {
      name: {
        show: true,
        required: false,
      },
      ssn: {
        show: true,
        required: false,
      },
      dateOfBirth: {
        show: true,
        required: false,
      },
    },
    hideOnReview: false,
  }),
};
