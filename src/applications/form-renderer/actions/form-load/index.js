export const DIGITAL_FORMS_FILENAME = 'digital-forms.json';
export const FORM_LOADING_INITIATED = 'FORM_RENDERER/FORM_LOADING_INITIATED';
export const FORM_LOADING_SUCCEEDED = 'FORM_RENDERER/FORM_LOADING_SUCCEEDED';
export const FORM_LOADING_FAILED = 'FORM_RENDERER/FORM_LOADING_FAILED';
export const INTEGRATION_DEPLOYMENT =
  'https://pr18811-ps4nwwul37jtyembecv4bg0gafmyl3oj.ci.cms.va.gov';

import { fetchDrupalStaticDataFile } from 'platform/site-wide/drupal-static-data/connect/fetch';
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

export const fetchDrupalDigitalForms = () =>
  fetchDrupalStaticDataFile(DIGITAL_FORMS_FILENAME, INTEGRATION_DEPLOYMENT);

/**
 * Mocks a fetch of content-build forms data.
 * Keeping this here so that we can easily test new patterns without dealing
 * with content-build.
 */
export const mockFetchForms = async () => {
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

export const fetchFormConfig = (
  formId,
  fetchMethod = fetchDrupalDigitalForms,
) => {
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
