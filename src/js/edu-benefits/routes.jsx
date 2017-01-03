import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import EduBenefitsApp from './1990/containers/EduBenefitsApp';
import routes1990 from './1990/routes';
import form1990 from './1990/reducers';

export default function createRoutes(store) {
  // It will be confusing to have multiple forms in one app living
  // side by side in the Redux store, so just replace everything when you go into a form
  const onEnter = (reducer) => () => {
    store.replaceReducer(reducer);
  };

  // when we actually have more than one form, we should probably load them in
  // separate bundles
  return (
    <Route path="/">
      <IndexRedirect to="1990"/>
      <Route path="1990" onEnter={onEnter(form1990)} component={EduBenefitsApp}>
        {routes1990}
      </Route>
    </Route>
  );
}
