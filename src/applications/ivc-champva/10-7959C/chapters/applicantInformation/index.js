import { FEATURE_TOGGLES } from '../../hooks/useDefaultFormData';
import ageOver65 from './ageOver65';
import birthSex from './birthSex';
import contactInformation from './contactInformation';
import identityInformation from './identityInformation';
import mailingAddress from './mailingAddress';
import personalInformation from './personalInformation';

const REV2025_TOGGLE_KEY = `view:${FEATURE_TOGGLES[0]}`;

export const beneficiaryPages = {
  beneficiaryName: {
    path: 'applicant-info',
    title: 'Beneficiary’s name',
    ...personalInformation,
  },
  beneficiaryIdentityInfo: {
    path: 'applicant-identification-info',
    title: 'Beneficiary’s identification information',
    ...identityInformation,
  },
  beneficiaryAddress: {
    path: 'applicant-mailing-address',
    title: 'Beneficiary’s mailing address',
    ...mailingAddress,
  },
  beneficiaryContactInfo: {
    path: 'applicant-contact-info',
    title: 'Beneficiary’s contact information',
    ...contactInformation,
  },
  beneficiaryBirthSex: {
    path: 'applicant-gender',
    title: 'Beneficiary’s sex listed at birth',
    ...birthSex,
  },
  beneficiaryAge: {
    path: 'applicant-age',
    title: 'Beneficiary’s age',
    depends: formData => formData[REV2025_TOGGLE_KEY],
    ...ageOver65,
  },
};
