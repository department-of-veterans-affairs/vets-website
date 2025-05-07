import App from './containers/App.jsx';

const createRoutes = _store => {
  // The App component will now handle selection of formConfig and generation of child routes
  return [
    {
      path: '/', // Path relative to manifest.rootUrl. App will handle all sub-paths.
      component: App,
      // No `exact` prop here, so it matches '/' and all paths underneath it.
      // App.jsx's internal <Switch> will handle specific sub-paths like '/introduction'.
    },
  ];
};

export default createRoutes;
