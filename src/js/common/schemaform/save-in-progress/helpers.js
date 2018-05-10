import {
  createPageList,
  createFormPageList
} from '../helpers';
import RoutedSavablePage from './RoutedSavablePage';
import RoutedSavableReviewPage from './RoutedSavableReviewPage';
import FormSaved from './FormSaved';
import SaveInProgressErrorPage from './SaveInProgressErrorPage';

export function addSaveInProgressRoutes(config, routes) {
  const protectedRoutes = ['introduction', 'review-and-submit', 'confirmation', '*'];
  const formPages = createFormPageList(config);
  const pageList = createPageList(config, formPages);

  const newRoutes = routes;

  newRoutes.forEach((route) => {
    const indexOfRoute = newRoutes.indexOf(route);
    let newRoute;

    // rewrite page component
    if (!protectedRoutes.includes(route.path)) {
      newRoute = Object.assign({}, route, { component: RoutedSavablePage });
      if (indexOfRoute !== -1) {
        newRoutes[indexOfRoute] = newRoute;
      }
    }

    // rewrite review page component
    if (route.path === 'review-and-submit') {
      newRoute = Object.assign({}, route, { component: RoutedSavableReviewPage });
      if (indexOfRoute !== -1) {
        newRoutes[indexOfRoute] = newRoute;
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
  }

  if (!config.disableSave) {
    newRoutes.push({
      path: 'error',
      component: SaveInProgressErrorPage,
      pageList, // In case we need it for startOver?
      config
    });
  }

  if (!config.disableSave) {
    newRoutes.push({
      path: 'resume',
      pageList,
      config
    });
  }

  return newRoutes;
}