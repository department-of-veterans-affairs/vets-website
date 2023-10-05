import React from 'react';
import { useSelector } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
// import { replaceWithStagingDomain } from '~/platform/utilities/environment/stagingDomains';

const MrBreadcrumbs = () => {
  const crumbs = useSelector(state => state.mr.breadcrumbs.list);
  const currentPath = useSelector(state => state.mr.breadcrumbs.location);
  const allCrumbs = [...crumbs, currentPath];

  return (
    <>
      {allCrumbs.length > 0 && crumbs[0]?.url ? (
        <div className="vads-l-row breadcrumbs-container no-print">
          <VaBreadcrumbs label="Breadcrumb" mobileFirstProp>
            {allCrumbs.map((crumb, idx) => (
              <a href={crumb.url} key={idx}>
                Back to {crumb.label}
              </a>
            ))}
          </VaBreadcrumbs>
        </div>
      ) : (
        <div className="breadcrumbs-container" />
      )}
    </>
  );
};

export default MrBreadcrumbs;
