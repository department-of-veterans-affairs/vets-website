import {
  uploadWithInfoComponent,
  acceptableFiles,
} from '../Sponsor/sponsorFileUploads';

export const applicantBirthCertConfig = uploadWithInfoComponent(
  acceptableFiles.birthCert,
  'birth certificates',
  false,
);

export const applicantSchoolCertConfig = uploadWithInfoComponent(
  acceptableFiles.schoolCert,
  'school certifications',
  false,
);

export const applicantAdoptedConfig = uploadWithInfoComponent(
  acceptableFiles.adoptionCert,
  'adoption papers',
  false,
);

export const applicantStepChildConfig = uploadWithInfoComponent(
  acceptableFiles.stepCert,
  'marriage certificates',
  false,
);

export const applicantMedicarePartAPartBCardsConfig = uploadWithInfoComponent(
  acceptableFiles.medicareABCert,
  'copy of Medicare Parts A or B card',
  false,
);

export const applicantMedicarePartDCardsConfig = uploadWithInfoComponent(
  acceptableFiles.medicareDCert,
  'copy of Medicare Part D card',
  false,
);

export const applicantOhiCardsConfig = uploadWithInfoComponent(
  acceptableFiles.healthInsCert,
  'copy of other health insurance card',
  false,
);

export const applicant107959cConfig = uploadWithInfoComponent(
  acceptableFiles.va7959cCert,
  'VA Form 10-7959c',
  false,
);

export const applicantMarriageCertConfig = uploadWithInfoComponent(
  acceptableFiles.spouseCert,
  'marriage certificates',
  false,
);
