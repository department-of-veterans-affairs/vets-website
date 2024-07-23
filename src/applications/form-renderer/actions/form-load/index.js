export const FORM_LOADING_INITIATED = 'FORM_RENDERER/FORM_LOADING_INITIATED';
export const FORM_LOADING_SUCCEEDED = 'FORM_RENDERER/FORM_LOADING_SUCCEEDED';
export const FORM_LOADING_FAILED = 'FORM_RENDERER/FORM_LOADING_FAILED';

import { formConfig1, formConfig2 } from '../../config/form';

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

export const fetchFormConfig = formId => {
  /* eslint-disable-next-line no-shadow */
  const mockFetchFormConfigByFormId = async formId => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const formConfig = {
          '123-abc': formConfig1,
          '456-xyz': formConfig2,
        }?.[formId];

        if (formConfig) {
          resolve(formConfig);
        } else {
          reject(new Error('Form config not found'));
        }
      }, 2000);
    });
  };

  return async dispatch => {
    dispatch(formLoadingInitiated(formId));
    try {
      const formConfig = await mockFetchFormConfigByFormId(formId);
      dispatch(formLoadingSucceeded(formConfig));
      return formConfig;
    } catch (error) {
      dispatch(formLoadingFailed(`No form config found for formId=${formId}`));
      return undefined;
    }
  };
};
