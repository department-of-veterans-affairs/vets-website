export const CALLSTATUS = {
  pending: 'pending',
  success: 'success',
  failed: 'failed',
  skip: 'skipped',
  idle: 'idle',
};

/**
 * LGY API (https://int.services.lgy.va.gov/eligibility-manager/swagger-ui/index.html?configUrl=/eligibility-manager/v3/api-docs/swagger-config)
 * `/api/eligibility/determination` schema only showing:
 * ELIGIBLE, NOT_ELIGIBLE, PENDING, UNABLE_TO_DETERMINE_AUTOMATICALLY
 */
export const COE_ELIGIBILITY_STATUS = {
  eligible: 'ELIGIBLE',
  ineligible: 'NOT_NELIGIBLE',
  pending: 'PENDING',
  unableToDetermine: 'UNABLE_TO_DETERMINE_AUTOMATICALLY',

  // not supported?
  available: 'AVAILABLE',
  denied: 'DENIED',
  pendingUpload: 'PENDING-UPLOAD',
};

export const ACTIONS = {
  DOC_TYPE: 'DOC_TYPE',
  DOC_DESC: 'DOC_DESC',
  FILE_DESCRIPTION_REQUIRED: 'FILE_DESCRIPTION_REQUIRED',
  FILE_UPLOAD_SUCESS: 'FILE_UPLOAD_SUCCESS',
  FILE_UPLOAD_FAIL: 'FILE_UPLOAD_FAIL',
  FILE_UPLOAD_PENDING: 'FILE_UPLOAD_PENDING',
  FORM_SUBMIT_FAIL: 'FORM_SUBMIT_FAIL',
  FORM_SUBMIT_SUCCESS: 'FORM_SUBMIT_SUCCESS',
  FORM_SUBMIT_PENDING: 'FORM_SUBMIT_PENDING',
  DELETE_FILE: 'DELETE_FILE',
};
