import App from './containers/App.jsx';

const createRoutes = _store => {
  // The App component will now handle selection of formConfig and generation of child routes
  return {
    path: '/',
    component: App,
    // App will handle introduction redirect and its own child routes
  };
};

export default createRoutes;
