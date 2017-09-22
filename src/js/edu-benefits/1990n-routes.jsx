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
    }
  ];

  childRoutes.push({
    path: '*',
    onEnter: (nextState, replace) => replace('/')
  });

  return {
    path: '/',
    indexRoute: { onEnter: (nextState, replace) => replace('/1990n/introduction') },
    childRoutes
  };
}
