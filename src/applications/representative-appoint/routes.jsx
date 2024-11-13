import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App';

const route = {
  path: '/',
  component: App,
  indexRoute: {
    onEnter: (nextState, replace) => {
      const { location } = nextState;

      if (
        location.pathname === '/introduction' &&
        location.query.next === 'loginModal' &&
        location.query.postLogin === 'true'
      ) {
        replace('/');
      } else {
        replace('/introduction');
      }
    },
  },

  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;
