import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App';
import NextStepsPage from './containers/NextStepsPage';

const route = {
  path: '/',
  component: App,
  indexRoute: { onEnter: (_nextState, replace) => replace('/introduction') },

  childRoutes: [
    {
      path: 'next-steps',
      component: NextStepsPage,
    },
    ...createRoutesWithSaveInProgress(formConfig),
  ],
};

export default route;
