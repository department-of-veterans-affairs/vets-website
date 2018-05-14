import {
  createPageList,
  createFormPageList,
  createRoutes
} from '../helpers';
import RoutedSavablePage from './RoutedSavablePage';
import RoutedSavableReviewPage from './RoutedSavableReviewPage';
import FormSaved from './FormSaved';
import SaveInProgressErrorPage from './SaveInProgressErrorPage';

export function addSaveInProgressRoutes(config) {
  const protectedRoutes = new Set(['introduction', 'review-and-submit', 'confirmation', '*']);
  const formPages = createFormPageList(config);
  const pageList = createPageList(config, formPages);
  const newRoutes = createRoutes(config);

  newRoutes.forEach((route, index) => {
    let newRoute;

    // rewrite page component
    if (!protectedRoutes.has(route.path)) {
      newRoute = Object.assign({}, route, { component: RoutedSavablePage });
      if (index !== -1) {
        newRoutes[index] = newRoute;
      }
    }

    // rewrite review page component
    if (route.path === 'review-and-submit') {
      newRoute = Object.assign({}, route, { component: RoutedSavableReviewPage });
      if (index !== -1) {
        newRoutes[index] = newRoute;
      }
    }
  });

  if (!config.disableSave) {
    newRoutes.push({
      path: 'form-saved',
      component: FormSaved,
      pageList,
      config
    });

    newRoutes.push({
      path: 'error',
      component: SaveInProgressErrorPage,
      pageList, // In case we need it for startOver?
      config
    });

    newRoutes.push({
      path: 'resume',
      pageList,
      config
    });
  }

  return newRoutes;
}