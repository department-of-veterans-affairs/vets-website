import {
  createPageList,
  createFormPageList,
} from 'platform/forms-system/src/js/helpers';
import { createRoutes } from 'platform/forms-system/src/js/routing';
import RoutedSavablePage from './RoutedSavablePage';
import RoutedSavableReviewPage from './RoutedSavableReviewPage';
import FormSaved from './FormSaved';
import SaveInProgressErrorPage from './SaveInProgressErrorPage';

// only formConfig properties used are:
// urlPrefix, additionalRoutes, introduction, confirmation, chapters
export function createRoutesWithSaveInProgress(formConfigBase) {
  const protectedRoutes = new Set([
    'introduction',
    'review-and-submit',
    'confirmation',
    '*',
  ]);

  if (Array.isArray(formConfigBase.additionalRoutes)) {
    formConfigBase.additionalRoutes.forEach(route => {
      protectedRoutes.add(route.path);
    });
  }

  const formPages = createFormPageList(formConfigBase);
  const pageList = createPageList(formConfigBase, formPages);
  const newRoutes = createRoutes(formConfigBase);
  newRoutes.forEach((route, index) => {
    let newRoute;

    // rewrite page component
    if (!protectedRoutes.has(route.path)) {
      // wherever this code is called, it needs uiSchema
      newRoute = {
        ...route,
        component: RoutedSavablePage,
        formConfigBase, // <-----------
      };
      newRoutes[index] = newRoute;
    }

    // rewrite review page component
    if (route.path === 'review-and-submit') {
      newRoute = { ...route, component: RoutedSavableReviewPage };
      newRoutes[index] = newRoute;
    }
  });

  if (!formConfigBase.disableSave) {
    newRoutes.splice(newRoutes.length - 1, 0, {
      path: 'form-saved',
      component: formConfigBase.formSavedPage || FormSaved,
      pageList,
      formConfigBase,
    });

    newRoutes.splice(newRoutes.length - 1, 0, {
      path: 'error',
      component: SaveInProgressErrorPage,
      pageList, // In case we need it for startOver?
      formConfigBase,
    });

    newRoutes.splice(newRoutes.length - 1, 0, {
      path: 'resume',
      pageList,
      formConfigBase,
    });
  }

  return newRoutes;
}
