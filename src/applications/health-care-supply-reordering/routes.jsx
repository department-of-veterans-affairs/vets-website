import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import { useMyHealthAccessGuard } from '~/platform/mhv/hooks/useMyHealthAccessGuard';
import formConfig from './config/form';
import App from './containers/App';

const AccessGuardWrapper = ({ children }) => {
  const redirectToMyHealth = useMyHealthAccessGuard();
  if (redirectToMyHealth) {
    return null;
  }
  return children;
};

const route = {
  path: '/',
  component: AccessGuardWrapper,
  indexRoute: {
    onEnter: (nextState, replace) => replace('/introduction'),
  },
  childRoutes: [
    {
      component: App,
      childRoutes: createRoutesWithSaveInProgress(formConfig),
    },
  ],
};

export default route;
