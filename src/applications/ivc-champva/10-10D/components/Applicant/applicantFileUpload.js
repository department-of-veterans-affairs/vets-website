import { uploadWithInfoComponent } from '../Sponsor/sponsorFileUploads';

const marriagePapers = [
  'Marriage certificate',
  'Civil union papers',
  'Affidavit of common law marriage',
];

export const acceptableFiles = {
  birthCert: ['Birth certificate', 'Social Security card'],
  schoolCert: ['School enrollment certification form', 'Enrollment letter'],
  spouseCert: marriagePapers,
  stepCert: marriagePapers,
  adoptionCert: ['Court ordered adoption papers'],
  helplessCert: ['VBA decision rating certificate of award'],
  medicareABCert: [
    'Front of Medicare Parts A or B card',
    'Back of Medicare Parts A or B card',
  ],
  medicareDCert: [
    'Front of Medicare Part D card',
    'Back of Medicare Part D card',
  ],
  ssIneligible: ['Letter from the SSA'],
  healthInsCert: [
    'Front of health insurance card',
    'Back of health insurance card',
  ],
  va7959cCert: ['VA form 10-7959c'],
};

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
