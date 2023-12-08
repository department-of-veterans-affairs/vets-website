export const SET_CATEGORY_ID = 'SET_CATEGORY_ID';
export const SET_TOPIC_ID = 'SET_TOPIC_ID';
export const SET_UPDATED_IN_REVIEW = 'SET_UPDATED_IN_REVIEW';

export function setCategoryID(id) {
  return { type: SET_CATEGORY_ID, payload: id };
}

export function setTopicID(id) {
  return { type: SET_TOPIC_ID, payload: id };
}

export function setUpdatedInReview(page) {
  return { type: SET_UPDATED_IN_REVIEW, payload: page };
}
