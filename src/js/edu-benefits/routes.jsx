import EduBenefitsApp from './1990/containers/EduBenefitsApp';
import routes1990 from './1990/routes';
import form1990 from './1990/reducers';
import asyncLoader from '../common/components/asyncLoader';

export default function createRoutes(store) {
  // It will be confusing to have multiple forms in one app living side by side
  // in the Redux store, so just replace everything when you go into a form
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
    },
    {
      path: '1995',
      indexRoute: { onEnter: (nextState, replace) => replace('/1995/introduction') },
      component: asyncLoader(() => {
        return new Promise((resolve) => {
          require.ensure([], (require) => {
            store.replaceReducer(require('./1995/reducer').default);
            resolve(require('./1995/Form1995App').default);
          }, 'edu-1995');
        });
      }, 'Loading Form 22-1995'),
      getChildRoutes(partialNextState, callback) {
        require.ensure([], (require) => {
          callback(null, require('./1995/routes').default);
        }, 'edu-1995');
      },
    }
  ];

  if (__BUILDTYPE__ !== 'production') {
    childRoutes.push(
      {
        path: '1990e',
        indexRoute: { onEnter: (nextState, replace) => replace('/1990e/introduction') },
        component: asyncLoader(() => {
          return new Promise((resolve) => {
            require.ensure([], (require) => {
              store.replaceReducer(require('./1990e/reducer').default);
              resolve(require('./1990e/Form1990eApp').default);
            }, 'edu-1990e');
          });
        }, 'Loading Form 22-1990E'),
        getChildRoutes(partialNextState, callback) {
          require.ensure([], (require) => {
            callback(null, require('./1990e/routes').default);
          }, 'edu-1990e');
        },
      },
      {
        path: '5490',
        indexRoute: { onEnter: (nextState, replace) => replace('/5490/introduction') },
        component: asyncLoader(() => {
          return new Promise((resolve) => {
            require.ensure([], (require) => {
              store.replaceReducer(require('./5490/reducer').default);
              resolve(require('./5490/Form5490App').default);
            }, 'edu-5490');
          });
        }, 'Loading Form 22-5490'),
        getChildRoutes(partialNextState, callback) {
          require.ensure([], (require) => {
            callback(null, require('./5490/routes').default);
          }, 'edu-5490');
        },
      }
    );
  }

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
