import React from 'react';
import { Link, withRouter } from 'react-router';

const getFormInfo = router => {
  const childRoutes = router?.routes.map?.(route => {
    if (route.childRoutes && route.childRoutes.length > 0) {
      return route.childRoutes?.[0];
    }
    return null;
  });

  // we are assuming the first route with config is the same for all routes
  const firstRouteWithConfig = childRoutes.find(route => {
    return route?.formConfig;
  }, {});

  const pageListFormatted = firstRouteWithConfig?.pageList?.map(page => {
    return {
      path: page?.path,
      title: page?.title,
      pageKey: page?.pageKey,
      isActive: router?.location?.pathname === page?.path,
    };
  });

  return {
    pageList: pageListFormatted,
    formConfig: firstRouteWithConfig?.formConfig,
  };
};

const FormTabBase = props => {
  const formInfo = getFormInfo(props.router);

  return (
    <ul>
      {formInfo?.pageList ? (
        formInfo.pageList.map(page => (
          <li
            key={page.path}
            className="vads-u-padding--0 vads-u-margin-y--neg0p5"
          >
            <Link
              activeClassName="active vads-u-background-color--primary-alt-lightest vads-u-padding--0p5 vads-u-font-size--sm"
              to={page.path}
              className="vads-u-padding--0 vads-u-font-size--sm"
            >
              {page.title || page.pageKey || page.path}
            </Link>
          </li>
        ))
      ) : (
        <li>No form system pages found</li>
      )}
    </ul>
  );
};

export const FormTab = withRouter(FormTabBase);
