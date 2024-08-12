export const FORM_LOADING_INITIATED = 'FORM_RENDERER/FORM_LOADING_INITIATED';
export const FORM_LOADING_SUCCEEDED = 'FORM_RENDERER/FORM_LOADING_SUCCEEDED';
export const FORM_LOADING_FAILED = 'FORM_RENDERER/FORM_LOADING_FAILED';

import {
  formConfig1,
  formConfig2,
  normalizedForm,
} from '../../_config/formConfig';
import { createFormConfig } from '../../utils/formConfig';

export const formLoadingInitiated = formId => {
  return {
    type: FORM_LOADING_INITIATED,
    formId,
  };
};

export const formLoadingSucceeded = formConfig => {
  return {
    type: FORM_LOADING_SUCCEEDED,
    formConfig,
  };
};

export const formLoadingFailed = error => {
  return {
    type: FORM_LOADING_FAILED,
    error,
  };
};

/**
 * Mocks a fetch of content-build forms data.
 * Keeping this here so that we can easily test new patterns without dealing
 * with content-build.
 */
const mockFetchForms = async () => {
  const forms = [formConfig1, formConfig2, normalizedForm];

  return new Promise(r => setTimeout(r, 200, forms));
};

export const findFormByFormId = (forms, formId) => {
  const form = forms.find(f => f.formId === formId);

  if (form) {
    return form;
  }
  throw new Error(`Form config not found for form id '${formId}'`);
};

export const fetchFormConfig = (formId, fetchMethod = mockFetchForms) => {
  return async dispatch => {
    dispatch(formLoadingInitiated(formId));
    try {
      const forms = await fetchMethod();
      const form = findFormByFormId(forms, formId);
      const formConfig = createFormConfig(form);

      dispatch(formLoadingSucceeded(formConfig));

      return formConfig;
    } catch (error) {
      dispatch(formLoadingFailed(error));
      return undefined;
    }
  };
};
