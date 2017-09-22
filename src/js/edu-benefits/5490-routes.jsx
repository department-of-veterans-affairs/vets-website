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
    }
  ];

  childRoutes.push({
    path: '*',
    onEnter: (nextState, replace) => replace('/')
  });

  return {
    path: '/',
    indexRoute: { onEnter: (nextState, replace) => replace('/5490/introduction') },
    childRoutes
  };
}
