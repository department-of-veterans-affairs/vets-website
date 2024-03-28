import { nextQuestionRoute } from './display-logic-questions';
import { pushToRoute } from './shared';

export const navigateForward = (SHORT_NAME, formValue, router) => {
  const nextRoute = nextQuestionRoute(SHORT_NAME, formValue);

  pushToRoute(nextRoute, router);
};

export const navigateBackward = router => {
  router.goBack();
};
