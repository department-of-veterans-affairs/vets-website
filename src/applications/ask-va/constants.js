const baseURL = '/ask_va_api/v0';

export const URL = {
  GET_CATEGORIES: `${baseURL}/categories`,
  GET_TOPICS: `/topics`,
  GET_SUBTOPICS: `${baseURL}/topics`,
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
