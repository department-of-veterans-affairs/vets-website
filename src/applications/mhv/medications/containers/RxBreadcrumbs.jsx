import React from 'react';
import { useSelector } from 'react-redux';
// import { replaceWithStagingDomain } from '~/platform/utilities/environment/stagingDomains';
import { useLocation } from 'react-router-dom';
import { medicationsUrls } from '../util/constants';

const RxBreadcrumbs = () => {
  const location = useLocation();
  const crumbs = useSelector(state => state.rx.breadcrumbs.list);
  const currentPath = useSelector(state => state.rx.breadcrumbs.location);
  const allCrumbs = [...crumbs, currentPath];
  const oneLevelDeepCrumb = allCrumbs?.length - 2;
  return (
    <>
      {!medicationsUrls.MEDICATIONS_ABOUT.endsWith(location.pathname) &&
        !medicationsUrls.MEDICATIONS_REFILL.endsWith(location.pathname) &&
        allCrumbs.length > 0 &&
        allCrumbs[0]?.url && (
          <div className="no-print">
            <div
              className="vads-l-row vads-u-padding-y--3"
              label="Breadcrumb"
              data-testid="rx-breadcrumb"
            >
              <span className="breadcrumb-angle vads-u-padding-right--1">
                {'\u2039'}{' '}
              </span>
              <a href={crumbs[oneLevelDeepCrumb].url}>
                Back to {crumbs[oneLevelDeepCrumb].label}
              </a>
            </div>
          </div>
        )}
    </>
  );
};

export default RxBreadcrumbs;
