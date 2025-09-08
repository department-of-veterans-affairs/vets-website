import { personalInformationPage } from 'platform/forms-system/src/js/components/PersonalInformation';
import { isLoggedInVeteranPreparer } from '../../utils/helpers2';

// Use the platform's personal information component for logged in veteran preparers
export const veteranApplicantDetailsReviewPreparerPage = personalInformationPage(
  {
    key: 'veteranApplicantDetailsReviewPreparer',
    title: 'Review applicant information',
    path: 'veteran-applicant-details-review-preparer',
    depends: formData => isLoggedInVeteranPreparer(formData),
    background: true,
    personalInfoConfig: {
      name: { show: true, required: false },
      ssn: { show: true, required: false },
      dateOfBirth: { show: true, required: false },
      vaFileNumber: { show: false, required: false },
      sex: { show: false, required: false },
    },
    dataAdapter: {
      ssnPath: 'application.claimant.ssn',
    },
  },
);
