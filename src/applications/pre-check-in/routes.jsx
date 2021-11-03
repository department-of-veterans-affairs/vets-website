import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import Container from './containers/Container.jsx';

const onFormEnter = (uuid, window) => {
  return (nextState, replace) => {
    if (uuid) {
      replace(`/introduction?id=${uuid}`);
    } else {
      window.location.replace('/');
    }
  };
};

const getAppointmentIdFromUrl = (window, key = 'id') => {
  if (!window) return null;
  if (!window.location) return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
};
const urlId = getAppointmentIdFromUrl(window);

const route = {
  path: '/',
  component: Container,
  indexRoute: {
    onEnter: onFormEnter(urlId, window),
  },

  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;
