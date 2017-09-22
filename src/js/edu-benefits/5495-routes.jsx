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
    }
  ];

  childRoutes.push({
    path: '*',
    onEnter: (nextState, replace) => replace('/')
  });

  return {
    path: '/',
    indexRoute: { onEnter: (nextState, replace) => replace('/5495/introduction') },
    childRoutes
  };
}
