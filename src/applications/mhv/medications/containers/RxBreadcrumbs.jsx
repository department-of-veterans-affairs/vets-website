import React from 'react';
import { useSelector } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
// import { replaceWithStagingDomain } from '~/platform/utilities/environment/stagingDomains';
import { Link } from 'react-router-dom';
import { medicationsUrls } from '../util/constants';

const alignToLeft = `va-nav-breadcrumbs xsmall-screen:vads-u-margin-left--neg1 
small-screen:vads-u-margin-left--neg1 
medium-screen:vads-u-margin-left--neg2
small-desktop-screen:vads-u-margin-left--neg2
large-screen:vads-u-margin-left--0 `;

const getLinkUrl = crumb => {
  return crumb.url === medicationsUrls.MEDICATIONS_URL
    ? medicationsUrls.MEDICATIONS_URL
    : crumb.url.replace(medicationsUrls.MEDICATIONS_URL, '');
};

const RxBreadcrumbs = () => {
  const crumbs = useSelector(state => state.rx.breadcrumbs.list);
  const currentPath = useSelector(state => state.rx.breadcrumbs.location);
  const allCrumbs = [...crumbs, currentPath];
  return (
    <>
      {allCrumbs.length > 0 &&
        allCrumbs[0]?.url && (
          <div className="no-print">
            <VaBreadcrumbs
              label="Breadcrumb"
              className={`${alignToLeft} vads-u-padding-bottom--0 vads-u-padding-top--4 vads-u-margin-bottom--neg1p5`}
            >
              {allCrumbs.map((crumb, idx) => (
                <li key={idx}>
                  {crumb.url === medicationsUrls.MEDICATIONS_ABOUT ? ( // Assign <a> tag for link outside app's router
                    <a href={crumb.url}>{crumb.label}</a>
                  ) : (
                    <Link to={getLinkUrl(crumb)}>{crumb.label}</Link>
                  )}
                </li>
              ))}
            </VaBreadcrumbs>
          </div>
        )}
    </>
  );
};

export default RxBreadcrumbs;
