import { TaskComplete } from '../containers/TaskComplete';

export const taskCompletePage = {
  title: "You're done!",
  path: 'complete',
  CustomPage: TaskComplete,
  CustomPageReview: null,
  uiSchema: {},
  schema: { type: 'object', properties: {} },
};
