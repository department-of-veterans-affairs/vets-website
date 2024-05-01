import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { replaceWithStagingDomain } from '~/platform/utilities/environment/stagingDomains';
import { useLocation } from 'react-router-dom';
import { BreadcrumbLink } from '@department-of-veterans-affairs/mhv/exports';
import { removeBreadcrumbs, setBreadcrumbs } from '../actions/breadcrumbs';
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
              <BreadcrumbLink
                to={crumbs[oneLevelDeepCrumb]?.url}
                onClick={backLink}
                label={`Back to ${crumbs[oneLevelDeepCrumb]?.label}`}
              />
            </div>
          </div>
        )}
    </>
  );
};

export default RxBreadcrumbs;
