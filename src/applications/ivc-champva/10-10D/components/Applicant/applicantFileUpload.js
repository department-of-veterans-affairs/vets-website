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

export const applicantMarriageCertConfig = uploadWithInfoComponent(
  ['Marriage certificate', 'Civil union papers'],
  'marriage certificates',
  false,
);
