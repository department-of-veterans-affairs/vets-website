import EduBenefitsApp from './1990/containers/EduBenefitsApp';
import routes1990 from './1990/routes';
import form1990 from './1990/reducers';

import Form1995App from './1995/Form1995App';
import routes1995 from './1995/routes';

export default function createRoutes(store) {
  // It will be confusing to have multiple forms in one app living
  // side by side in the Redux store, so just replace everything when you go into a form
  const onEnter = (reducer) => () => {
    store.replaceReducer(reducer);
  };

  const childRoutes = [
    {
      path: '1990',
      indexRoute: { onEnter: (nextState, replace) => replace('/1990/introduction') },
      onEnter: onEnter(form1990),
      component: EduBenefitsApp,
      childRoutes: routes1990
    }
  ];

  if (__BUILDTYPE__ === 'development') {
    childRoutes.push(
      {
        path: '1995',
        indexRoute: { onEnter: (nextState, replace) => replace('/1995/introduction') },
        getComponent(nextState, callback) {
          require.ensure([], (require) => {
            store.replaceReducer(require('./1995/reducer').default);
            callback(null, require('./1995/Form1995App').default);
          }, 'edu-1995');
        },
        getChildRoutes(partialNextState, callback) {
          require.ensure([], (require) => {
            callback(null, require('./1995/routes').default);
          }, 'edu-1995');
        },
      }
    );
  }

  const routesFor1995 = __BUILDTYPE__ !== 'production' && __BUILDTYPE__ !== 'staging'
    ? <Route path="1995" component={Form1995App}>
      {routes1995}
    </Route>
    : null;

  childRoutes.push({
    path: '*',
    onEnter: (nextState, replace) => replace('/')
  });

  return {
    path: '/',
    indexRoute: { onEnter: (nextState, replace) => replace('/1990/introduction') },
    childRoutes
  };
}
