export const DIGITAL_FORMS_FILENAME = 'digital-forms.json';
export const FORM_LOADING_INITIATED = 'FORM_RENDERER/FORM_LOADING_INITIATED';
export const FORM_LOADING_SUCCEEDED = 'FORM_RENDERER/FORM_LOADING_SUCCEEDED';
export const FORM_LOADING_FAILED = 'FORM_RENDERER/FORM_LOADING_FAILED';

import { fetchDrupalStaticDataFile } from 'platform/site-wide/drupal-static-data/connect/fetch';
import environment from 'platform/utilities/environment';
import mockForms from '../../config/formConfig';
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
  fetchDrupalStaticDataFile(DIGITAL_FORMS_FILENAME, environment.BASE_URL);

/**
 * Mocks a fetch of content-build forms data.
 * Keeping this here so that we can easily test new patterns without dealing
 * with content-build.
 */
export const mockFetchForms = async () =>
  new Promise(r => setTimeout(r, 200, mockForms));

export const filterForms = (forms, onlyPublished) =>
  onlyPublished
    ? forms.filter(form => form.moderationState === 'published')
    : forms;

export const findFormByFormId = (forms, formId) => {
  const form = forms.find(f => f.formId === formId);

  if (form) {
    return form;
  }
  throw new Error(`Form config not found for form id '${formId}'`);
};

export const fetchAndBuildFormConfig = (
  formId,
  options,
  fetchMethod = fetchDrupalDigitalForms,
) => {
  return async dispatch => {
    dispatch(formLoadingInitiated(formId));
    try {
      const forms = await fetchMethod();
      const filteredForms = filterForms(forms, environment.isProduction());
      const form = findFormByFormId(filteredForms, formId);
      const formConfig = createFormConfig(form, options);

      dispatch(formLoadingSucceeded(formConfig));

      return formConfig;
    } catch (error) {
      dispatch(formLoadingFailed(error));
      return undefined;
    }
  };
};
