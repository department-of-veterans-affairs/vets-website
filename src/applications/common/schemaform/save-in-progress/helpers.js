import {
  createPageList,
  createFormPageList,
  createRoutes
} from '../helpers';
import RoutedSavablePage from './RoutedSavablePage';
import RoutedSavableReviewPage from './RoutedSavableReviewPage';
import FormSaved from './FormSaved';
import SaveInProgressErrorPage from './SaveInProgressErrorPage';

export function createRoutesWithSaveInProgress(config) {
  const protectedRoutes = new Set(['introduction', 'review-and-submit', 'confirmation', '*']);
  const formPages = createFormPageList(config);
  const pageList = createPageList(config, formPages);
  const newRoutes = createRoutes(config);

  newRoutes.forEach((route, index) => {
    let newRoute;

    // rewrite page component
    if (!protectedRoutes.has(route.path)) {
      newRoute = Object.assign({}, route, { component: RoutedSavablePage });
      newRoutes[index] = newRoute;
    }

    // rewrite review page component
    if (route.path === 'review-and-submit') {
      newRoute = Object.assign({}, route, { component: RoutedSavableReviewPage });
      newRoutes[index] = newRoute;
    }
  });

  if (!config.disableSave) {
    // const lengthOfRoutes = newRoutes.length;
    // const positionToAddRoutes = lengthOfRoutes - 1;

    newRoutes.splice(newRoutes.length - 1, 0, {
      path: 'form-saved',
      component: FormSaved,
      pageList,
      config
    });

    newRoutes.splice(newRoutes.length - 1, 0, {
      path: 'error',
      component: SaveInProgressErrorPage,
      pageList, // In case we need it for startOver?
      config
    });

    newRoutes.splice(newRoutes.length - 1, 0, {
      path: 'resume',
      pageList,
      config
    });
  }

  return newRoutes;
}
