import { personalInformationPage } from 'platform/forms-system/src/js/components/PersonalInformation';

export default {
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
