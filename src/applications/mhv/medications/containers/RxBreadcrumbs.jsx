import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { replaceWithStagingDomain } from '~/platform/utilities/environment/stagingDomains';
import { Link } from 'react-router-dom';
import { removeBreadcrumbs } from '../actions/breadcrumbs';

const RxBreadcrumbs = () => {
  const dispatch = useDispatch();
  const crumbs = useSelector(state => state.rx.breadcrumbs?.list);
  const oneLevelDeepCrumb = crumbs?.length - 1;
  const backLink = () => {
    dispatch(removeBreadcrumbs());
  };
  return (
    <>
      {crumbs.length > 0 &&
        crumbs[0]?.url && (
          <div className="no-print">
            <div
              className="vads-l-row vads-u-padding-y--3"
              label="Breadcrumb"
              data-testid="rx-breadcrumb"
            >
              <span className="breadcrumb-angle vads-u-padding-right--1">
                {'\u2039'}{' '}
              </span>
              <Link to={crumbs[oneLevelDeepCrumb]?.url} onClick={backLink}>
                Back to {crumbs[oneLevelDeepCrumb]?.label}
              </Link>
            </div>
          </div>
        )}
    </>
  );
};

export default RxBreadcrumbs;
