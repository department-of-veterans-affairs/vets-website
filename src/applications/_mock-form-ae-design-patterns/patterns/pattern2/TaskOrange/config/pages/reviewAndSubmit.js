import { scrollAndFocusTarget } from 'applications/_mock-form-ae-design-patterns/utils/focus';
import ReviewPage from '../../pages/review-then-submit/ReviewPage';

export const reviewAndSubmit = {
  title: 'Review and submit',
  path: 'review-then-submit',
  CustomPage: ReviewPage,
  CustomPageReview: null,
  uiSchema: {},
  schema: {
    definitions: {},
    type: 'object',
    properties: {},
  },
  scrollAndFocusTarget,
};
