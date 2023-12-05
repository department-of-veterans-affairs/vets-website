export const PREPARER_TYPES = Object.freeze({
  CITIZEN: 'citizen',
  NON_CITIZEN: 'non-citizen',
  THIRD_PARTY: 'third-party',
});
export const PREPARER_TYPE_LABELS = Object.freeze({
  [PREPARER_TYPES.CITIZEN]:
    'I’m a U.S. citizen requesting my own personal VA records',
  [PREPARER_TYPES.NON_CITIZEN]:
    'I’m a non-U.S. citizen requesting my own personal VA records',
  [PREPARER_TYPES.THIRD_PARTY]:
    'I’m a third-party or power of attorney requesting personal VA records for someone else',
});

export const RECORD_TYPES = Object.freeze({
  DD214: 'dd214',
  C_FILE: 'c-file',
  DISABILITY_EXAMS: 'disability-exams',
  OMPF: 'ompf',
  PENSION: 'pension',
  TREATMENT: 'treatment',
  OTHER_COMP_PEN: 'other-comp-pen',
  EDUCATION: 'education',
  FIDUCIARY: 'fiduciary',
  FINANCIAL: 'financial',
  HOME_LOAN: 'home-loan',
  LIFE_INS: 'life-ins',
  VRE: 'vre',
  OTHER: 'other',
});
export const RECORD_TYPE_LABELS = Object.freeze({
  [RECORD_TYPES.DD214]:
    'Certificate of Release or Discharge from Active Duty (DD Form 214)',
  [RECORD_TYPES.C_FILE]: 'Claims File (C-file)',
  [RECORD_TYPES.DISABILITY_EXAMS]: 'Disability examinations (C&P exams)',
  [RECORD_TYPES.OMPF]: 'Official military personnel file (OMPF)',
  [RECORD_TYPES.PENSION]: 'Pension benefit documents',
  [RECORD_TYPES.TREATMENT]: 'Service or military treatment',
  [RECORD_TYPES.OTHER_COMP_PEN]: 'Other compensation and/or pension record',
  [RECORD_TYPES.EDUCATION]: 'Education benefit',
  [RECORD_TYPES.FIDUCIARY]: 'Fiduciary services',
  [RECORD_TYPES.FINANCIAL]: 'Financial records',
  [RECORD_TYPES.HOME_LOAN]: 'Home loan benefit',
  [RECORD_TYPES.LIFE_INS]: 'Life insurance benefit',
  [RECORD_TYPES.VRE]: 'Vocational rehabilitation and employment',
  [RECORD_TYPES.OTHER]: 'Other benefit records',
});
