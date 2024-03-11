import React from 'react';
import { useSelector } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
// import { replaceWithStagingDomain } from '~/platform/utilities/environment/stagingDomains';
import { useLocation } from 'react-router-dom';
import { medicationsUrls } from '../util/constants';

const alignToLeft = `va-nav-breadcrumbs xsmall-screen:vads-u-margin-left--neg1 
small-screen:vads-u-margin-left--neg1 
medium-screen:vads-u-margin-left--neg2
small-desktop-screen:vads-u-margin-left--neg2
large-screen:vads-u-margin-left--0 `;

const RxBreadcrumbs = () => {
  const location = useLocation();
  const crumbs = useSelector(state => state.rx.breadcrumbs.list);
  const currentPath = useSelector(state => state.rx.breadcrumbs.location);
  const allCrumbs = [...crumbs, currentPath];
  return (
    <>
      {!medicationsUrls.MEDICATIONS_ABOUT.endsWith(location.pathname) &&
        !medicationsUrls.MEDICATIONS_REFILL.endsWith(location.pathname) &&
        allCrumbs.length > 0 &&
        allCrumbs[0]?.url && (
          <div className="no-print">
            <VaBreadcrumbs
              uswds
              label="Breadcrumb"
              data-testid="rx-breadcrumb"
              breadcrumbList={allCrumbs.map(crumb => ({
                href: crumb.url,
                label: crumb.label,
              }))}
              className={`${alignToLeft} va-breadcrumbs-li vads-u-padding-bottom--0 vads-u-padding-top--4 vads-u-margin-bottom--neg1p5`}
            />
          </div>
        )}
    </>
  );
};

export default RxBreadcrumbs;
