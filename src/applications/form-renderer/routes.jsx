import App from './containers/App';

const route = {
  path: '/',
  component: App,
  // indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },

  childRoutes: null,
};

export default route;
