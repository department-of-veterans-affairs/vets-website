import { uploadWithInfoComponent } from '../Sponsor/sponsorFileUploads';

export const applicantBirthCertConfig = uploadWithInfoComponent(
  ['Birth certificate', 'Social Security card'],
  'birth certificates',
  false,
);

export const applicantSchoolCertConfig = uploadWithInfoComponent(
  ['School certification'],
  'school certifications',
  false,
);

export const applicantAdoptedConfig = uploadWithInfoComponent(
  ['Court ordered adoption papers'],
  'adoption papers',
  false,
);

export const applicantStepChildConfig = uploadWithInfoComponent(
  ['Marriage certificate'],
  'marriage certificates',
  false,
);

export const applicantMedicarePartAPartBCardsConfig = uploadWithInfoComponent(
  ['Front of Medicare Parts A or B card', 'Back of Medicare Parts A or B card'],
  'copy of Medicare Parts A or B card',
  false,
);

export const applicantMedicarePartDCardsConfig = uploadWithInfoComponent(
  ['Front of Medicare Part D card', 'Back of Medicare Part D card'],
  'copy of Medicare Part D card',
  false,
);

export const applicantOhiCardsConfig = uploadWithInfoComponent(
  ['Front of health insurance card', 'Back of health insurance card'],
  'copy of other health insurance card',
  false,
);

export const applicant107959cConfig = uploadWithInfoComponent(
  ['PDF of VA Form 10-7959c'],
  'VA Form 10-7959c',
  false,
);

export const applicantMarriageCertConfig = uploadWithInfoComponent(
  ['Marriage certificate', 'Civil union papers'],
  'marriage certificates',
  false,
);
