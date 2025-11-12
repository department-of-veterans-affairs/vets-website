import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import NewDesignSwitcher from './NewDesignSwitcher';
import formConfig from './config/form';

const onEnter = (nextState, replace) => replace('/introduction');

const routes = [
  {
    path: '/',
    component: NewDesignSwitcher,
    indexRoute: { onEnter },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;
