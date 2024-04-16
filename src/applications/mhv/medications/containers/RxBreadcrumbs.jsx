import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { replaceWithStagingDomain } from '~/platform/utilities/environment/stagingDomains';
import { Link, useLocation } from 'react-router-dom';
import {
  removeBreadcrumbs,
  setBreadcrumbs,
  clearBreadcrumbs,
} from '../actions/breadcrumbs';
import { medicationsUrls } from '../util/constants';

const RxBreadcrumbs = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const crumbs = useSelector(state => state.rx.breadcrumbs?.list);
  const oneLevelDeepCrumb = crumbs?.length - 1;

  useEffect(
    () => {
      if (!crumbs?.length && !location.pathname.includes('/about')) {
        dispatch(
          setBreadcrumbs({
            url: medicationsUrls.subdirectories.ABOUT,
            label: 'About medications',
          }),
        );
      } else if (crumbs?.length && location.pathname.includes('/about')) {
        dispatch(clearBreadcrumbs());
      }
    },
    [dispatch, crumbs, location.pathname],
  );

  const backLink = () => {
    dispatch(removeBreadcrumbs());
  };
  return (
    <>
      {crumbs.length > 0 &&
        crumbs[0]?.url && (
          <div className="no-print rx-breadcrumbs">
            <div
              className="vads-l-row vads-u-padding-y--3"
              label="Breadcrumb"
              data-testid="rx-breadcrumb"
            >
              <span className="breadcrumb-angle vads-u-padding-right--1">
                {'\u2039'}{' '}
              </span>
              <Link
                to={crumbs[oneLevelDeepCrumb]?.url}
                onClick={backLink}
                data-dd-action-name="Breadcrumb Link"
              >
                Back to {crumbs[oneLevelDeepCrumb]?.label}
              </Link>
            </div>
          </div>
        )}
    </>
  );
};

export default RxBreadcrumbs;
