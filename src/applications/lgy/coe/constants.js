export const COE_FORM_NUMBER = '26-1880';

export const CALLSTATUS = {
  pending: 'pending',
  success: 'success',
  failed: 'failed',
  skip: 'skipped',
  idle: 'idle',
};

export const COE_ELIGIBILITY_STATUS = {
  eligible: 'eligible',
  ineligible: 'ineligible',
  unableToDetermine: 'unable-to-determine-eligibility',
  pending: 'pending',
};

export const DOCUMENT_TYPES = [
  'Discharge or seperation papers (DD214)',
  'Statement of service',
  'Retirement Points Statement (NGB Form 23)',
  'Proof of honorable service',
  'Annual retirement points',
  'VA home loan documents',
  'Disclosure from loan closing',
  'HUD-1 Stettlement Statement',
  'Statement from loan officer showing loan is paid in full',
  'ALTA statement',
  'Marriage certificate',
  'Divorce decree',
  'Name change document',
  'Birth certificate',
  'Other',
];

export const ACTIONS = {
  DOC_TYPE: 'DOC_TYPE',
  DOC_DESC: 'DOC_DESC',
  FILE_DESCRIPTION_REQUIRED: 'FILE_DESCRIPTION_REQUIRED',
  FILE_UPLOAD_SUCESS: 'FILE_UPLOAD_SUCCESS',
  FILE_UPLOAD_FAIL: 'FILE_UPLOAD_FAIL',
  FILE_UPLOAD_PENDING: 'FILE_UPLOAD_PENDING',
  FORM_SUBMIT_FAIL: 'FORM_SUBMIT_FAIL',
  DELETE_FILE: 'DELETE_FILE',
};

export const FILE_TYPES = ['pdf', 'gif', 'jpeg', 'jpg', 'bmp', 'txt', 'png'];
