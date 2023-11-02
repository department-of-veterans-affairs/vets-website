import React from 'react';
import { useSelector } from 'react-redux';
// temporarily using deprecated Breadcrumbs React component due to issues with VaBreadcrumbs that are pending resolution
// import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
// import { replaceWithStagingDomain } from '~/platform/utilities/environment/stagingDomains';

const MrBreadcrumbs = () => {
  const crumbs = useSelector(state => state.mr.breadcrumbs.list);
  const currentPath = useSelector(state => state.mr.breadcrumbs.location);

  return (
    <>
      {crumbs.length > 0 && crumbs[0]?.url ? (
        <div
          className="vads-l-row breadcrumbs-container no-print"
          data-testid="breadcrumbs"
        >
          <VaBreadcrumbs label="Breadcrumb" mobileFirstProp>
            {crumbs.map((crumb, idx) => (
              <a href={crumb.url} key={idx}>
                Back to {crumb.label}
              </a>
            ))}
            <a href={currentPath?.url}>{currentPath?.label}</a>
          </VaBreadcrumbs>
        </div>
      ) : (
        <div className="breadcrumbs-container" data-testid="no-breadcrumbs" />
      )}
    </>
  );
};

export default MrBreadcrumbs;
