import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// temporarily using deprecated Breadcrumbs React component due to issues with VaBreadcrumbs that are pending resolution
// import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
// import { replaceWithStagingDomain } from '~/platform/utilities/environment/stagingDomains';

const MrBreadcrumbs = () => {
  const location = useLocation();
  let crumbs = null;

  const paths = [
    { url: `/health-history`, label: `Health History` },
    { url: `/vaccines`, label: `VA Vaccines`, parent: `/health-history` },
    { url: `/vaccine`, label: `Vaccine Details`, parent: `/vaccines` },
  ];

  const currentPath = paths.filter(path => path.url === location.pathname)[0];
  if (currentPath?.parent) {
    [crumbs] = paths.filter(path => path.url === currentPath.parent);
  } else {
    crumbs = { url: '/', label: 'Dashboard' };
  }

  return (
    <>
      {crumbs?.url && (
        <div className="vads-l-row breadcrumbs-container">
          {/* per exisiting issue found here https://github.com/department-of-veterans-affairs/vets-design-system-documentation/issues/1296
          eslint-disable-next-line @department-of-veterans-affairs/prefer-web-component-library */}
          <div className="vads-u-margin-bottom--1 vads-u-margin-top--2">
            <span className="breadcrumb-angle vads-u-margin-x--1">
              {'\u2039'}{' '}
            </span>
            <Link key={1} to={crumbs?.url}>
              {crumbs?.label}
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default MrBreadcrumbs;
