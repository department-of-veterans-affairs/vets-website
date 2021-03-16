export const QUESTIONNAIRE_LIST_LOADING = 'QUESTIONNAIRE_LIST_LOADING';

export const QUESTIONNAIRE_LIST_LOADED = 'QUESTIONNAIRE_LIST_LOADED';

export const QUESTIONNAIRE_LIST_LOADED_WITH_ERROR =
  'QUESTIONNAIRE_LIST_LOADED_WITH_ERROR';

export const questionnaireListLoading = () => {
  return { type: QUESTIONNAIRE_LIST_LOADING };
};

export const questionnaireListLoadedWithError = () => {
  return { type: QUESTIONNAIRE_LIST_LOADED_WITH_ERROR };
};

export const questionnaireListLoaded = data => {
  return { type: QUESTIONNAIRE_LIST_LOADED, data };
};
