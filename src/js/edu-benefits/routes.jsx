import _ from 'lodash/fp';
import { combineReducers } from 'redux';
import asyncLoader from '../common/components/asyncLoader';
import { commonReducer } from '../common/store';

function createCommonReducer(reducer) {
  return combineReducers(_.assign(reducer, commonReducer));
}

export default function createRoutes(store) {
  const childRoutes = [
    {
      path: '1995',
      indexRoute: { onEnter: (nextState, replace) => replace('/1995/introduction') },
      component: asyncLoader(() => {
        return new Promise((resolve) => {
          require.ensure([], (require) => {
            store.replaceReducer(createCommonReducer(require('./1995/reducer').default));
            resolve(require('./1995/Form1995App').default);
          }, 'edu-1995');
        });
      }, 'Loading Form 22-1995'),
      getChildRoutes(partialNextState, callback) {
        require.ensure([], (require) => {
          callback(null, require('./1995/routes').default);
        }, 'edu-1995');
      },
    },
    {
      path: '1990e',
      indexRoute: { onEnter: (nextState, replace) => replace('/1990e/introduction') },
      component: asyncLoader(() => {
        return new Promise((resolve) => {
          require.ensure([], (require) => {
            store.replaceReducer(createCommonReducer(require('./1990e/reducer').default));
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
            store.replaceReducer(createCommonReducer(require('./5490/reducer').default));
            resolve(require('./5490/Form5490App').default);
          }, 'edu-5490');
        });
      }, 'Loading Form 22-5490'),
      getChildRoutes(partialNextState, callback) {
        require.ensure([], (require) => {
          callback(null, require('./5490/routes').default);
        }, 'edu-5490');
      },
    },
    {
      path: '1990n',
      indexRoute: { onEnter: (nextState, replace) => replace('/1990n/introduction') },
      component: asyncLoader(() => {
        return new Promise((resolve) => {
          require.ensure([], (require) => {
            store.replaceReducer(createCommonReducer(require('./1990n/reducer').default));
            resolve(require('./1990n/Form1990nApp').default);
          }, 'edu-1990n');
        });
      }, 'Loading Form 22-1990N'),
      getChildRoutes(partialNextState, callback) {
        require.ensure([], (require) => {
          callback(null, require('./1990n/routes').default);
        }, 'edu-1990n');
      },
    },
    {
      path: '5495',
      indexRoute: { onEnter: (nextState, replace) => replace('/5495/introduction') },
      component: asyncLoader(() => {
        return new Promise((resolve) => {
          require.ensure([], (require) => {
            store.replaceReducer(createCommonReducer(require('./5495/reducer').default));
            resolve(require('./5495/Form5495App').default);
          }, 'edu-5495');
        });
      }, 'Loading Form 22-5495'),
      getChildRoutes(partialNextState, callback) {
        require.ensure([], (require) => {
          callback(null, require('./5495/routes').default);
        }, 'edu-5495');
      },
    },
    {
      path: '1990',
      indexRoute: { onEnter: (nextState, replace) => replace('/1990/introduction') },
      component: asyncLoader(() => {
        return new Promise((resolve) => {
          require.ensure([], (require) => {
            store.replaceReducer(createCommonReducer(require('./1990-rjsf/reducer').default));
            resolve(require('./1990-rjsf/Form1990App').default);
          }, 'edu-1990');
        });
      }, 'Loading Form 22-1990'),
      getChildRoutes(partialNextState, callback) {
        require.ensure([], (require) => {
          callback(null, require('./1990-rjsf/routes').default);
        }, 'edu-1990');
      }
    }
  ];

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
