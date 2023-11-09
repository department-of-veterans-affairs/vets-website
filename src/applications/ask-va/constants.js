const baseURL = '/ask_va_api/v0';

export const URL = {
  GET_CATEGORIES: `${baseURL}/categories?mock=true`,
  GET_TOPICS: `/topics?mock=true`,
  GET_SUBTOPICS: `${baseURL}/topics?mock=true`,
  // TODO: Add address validation endpoint
  ADDRESS_VALIDATION: '',
};

export const requireSignInCategories = [
  'Education (Ch.30, 33, 35, 1606, etc. & Work Study)',
  'Compensation (Service-Connected Bens)',
];

export const requireSignInTopics = [
  'Compensation',
  'Education (Ch.30, 33, 35, 1606, etc. & Work Study)',
];

// list of topics required to render the subtopic page
export const requiredForSubtopicPage = ['GI Bill'];
