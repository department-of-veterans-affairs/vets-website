import React from 'react';
import { Link, withRouter } from 'react-router';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ChapterAnalyzer from './ChapterAnalyzer';
import { FormDataViewer } from './FormDataViewer';

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
  const specialPages = formInfo?.pageList?.filter(
    page =>
      page.path?.includes('/introduction') ||
      page.path?.includes('/review-and-submit'),
  );

  const formData = useSelector(state => state?.form?.data);

  return (
    <div>
      <div className="vads-u-margin-top--0 vads-u-display--flex vads-u-justify-content--space-between vads-u-align-items--center">
        {specialPages?.length > 0
          ? specialPages.map((page, index) => (
              <Link
                key={page.path}
                activeClassName="active vads-u-background-color--primary-alt-lightest"
                to={page.path}
                className={`vads-u-padding--0p5 vads-u-font-size--sm vads-u-text-align--center vads-u-flex--1 ${
                  index === 0 ? 'vads-u-margin-left--0' : ''
                }`}
              >
                {page.title || page.pageKey || page.path}
              </Link>
            ))
          : null}
      </div>
      <ChapterAnalyzer
        formConfig={formInfo?.formConfig}
        urlPrefix={formInfo?.formConfig?.urlPrefix}
      />
      <FormDataViewer data={formData || {}} />
    </div>
  );
};

FormTabBase.propTypes = {
  router: PropTypes.object.isRequired,
};

export const FormTab = withRouter(FormTabBase);
