import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';

import App from './containers/App';
import formConfig from './config/form';

// Convert onEnter hook to useEffect pattern
const IndexRedirectComponent = () => {
  const history = useHistory();

  useEffect(
    () => {
      history.replace('/introduction');
    },
    [history],
  );

  return null;
};

const routes = [
  {
    path: '/',
    component: App,
    indexRoute: { component: IndexRedirectComponent },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;
