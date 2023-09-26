import React from 'react';
import { useSelector } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
// import { replaceWithStagingDomain } from '~/platform/utilities/environment/stagingDomains';

const alignToLeft = `xsmall-screen:vads-u-margin-left--neg1 
small-screen:vads-u-margin-left--neg1 
medium-screen:vads-u-margin-left--neg2
small-desktop-screen:vads-u-margin-left--neg2
large-screen:vads-u-margin-left--0 `;

const RxBreadcrumbs = () => {
  const crumbs = useSelector(state => state.rx.breadcrumbs.list);
  const currentPath = useSelector(state => state.rx.breadcrumbs.location);

  return (
    <>
      {crumbs.length > 0 &&
        crumbs[0]?.url && (
          <div
            className={`${alignToLeft} vads-u-padding-bottom--0 vads-u-padding-top--4 vads-u-margin-bottom--neg1p5`}
          >
            {/* per exisiting issue found here https://github.com/department-of-veterans-affairs/vets-design-system-documentation/issues/1296 */}
            {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-web-component-library */}
            {/* <Breadcrumbs
              label="Breadcrumb"
              className={`${alignToLeft} vads-u-padding-bottom--0 vads-u-padding-top--4 vads-u-margin-bottom--neg1p5`}
            >
              {crumbs.map((crumb, idx) => (
                <a href={crumb.url} key={idx}>
                  {crumb.label}
                </a>
              ))}
              <a href={currentPath?.url}>{currentPath?.label}</a>
            </Breadcrumbs> */}
            <VaBreadcrumbs label="Breadcrumb">
              {crumbs.map((crumb, idx) => (
                <a href={crumb.url} key={idx}>
                  {crumb.label}
                </a>
              ))}
              <a href={currentPath?.url}>{currentPath?.label}</a>
            </VaBreadcrumbs>
          </div>
        )}
    </>
  );
};

export default RxBreadcrumbs;
