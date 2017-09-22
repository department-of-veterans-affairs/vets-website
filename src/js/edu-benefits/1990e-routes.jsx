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
  ];

  childRoutes.push({
    path: '*',
    onEnter: (nextState, replace) => replace('/')
  });

  return {
    path: '/',
    indexRoute: { onEnter: (nextState, replace) => replace('/1990e/introduction') },
    childRoutes
  };
}
