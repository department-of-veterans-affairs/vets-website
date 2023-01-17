import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
// temporarily using deprecated Breadcrumbs React component due to issues with VaBreadcrumbs that are pending resolution
// import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
// import { replaceWithStagingDomain } from '~/platform/utilities/environment/stagingDomains';
import { setBreadcrumbs } from '../actions/breadcrumbs';

const MrBreadcrumbs = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const breadcrumbsRef = useRef();
  const crumbs = useSelector(state => state.mr?.breadcrumbs.list);
  const vaccineDetails = useSelector(state => state.mr?.vaccineDetails);
  const [isMobile, setIsMobile] = useState(false);

  function checkScreenSize() {
    if (window.innerWidth <= 481 && setIsMobile !== false) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }
  useEffect(
    () => {
      checkScreenSize();
    },
    [isMobile],
  );

  window.addEventListener('resize', checkScreenSize);

  useEffect(
    () => {
      const paths = [
        { path: `/`, label: 'Medical records home' },
        { path: '/vaccine', label: vaccineDetails?.name },
      ];

      function handleBreadCrumbs() {
        const arr = [];
        // arr.push({
        //   path: replaceWithStagingDomain('https://www.va.gov'),
        //   label: 'VA.gov home',
        // });
        // arr.push({
        //   path: replaceWithStagingDomain('https://www.va.gov/health-care/'),
        //   label: 'My Health',
        // });
        arr.push({ path: '/', label: 'Dashboard' });

        paths.forEach(path => {
          const [
            ,
            locationBasePath,
            locationChildPath,
          ] = location.pathname.split('/');
          if (path.path.substring(1) === locationBasePath) {
            arr.push(path);
            if (locationChildPath && path.children) {
              const child = path.children.find(
                item => item.path.substring(1) === locationChildPath,
              );
              if (child) {
                arr.push(child);
              }
            }
          }
        });
        dispatch(setBreadcrumbs(arr, location));
      }
      handleBreadCrumbs();
    },
    [location, dispatch],
  );

  return (
    <div className="vads-l-row breadcrumbs">
      {crumbs?.length > 0 && (
        // per exisiting issue found here https://github.com/department-of-veterans-affairs/vets-design-system-documentation/issues/1296
        // eslint-disable-next-line @department-of-veterans-affairs/prefer-web-component-library
        <Breadcrumbs ref={breadcrumbsRef}>
          {isMobile ? (
            crumbs?.map((crumb, i) => {
              if (crumb.path.includes('https://')) {
                return (
                  <a key={i} href={crumb.path}>
                    Return to {crumb.label}
                  </a>
                );
              }
              return (
                <Link key={i} to={crumb.path}>
                  Return to {crumb.label}
                </Link>
              );
            })
          ) : (
            <>
              {crumbs.length > 1 && (
                <>
                  <span className="breadcrumb-angle">{'\u2039'} </span>
                  <Link
                    className="desktop-view-crumb"
                    key={1}
                    to={crumbs[crumbs.length - 2]?.path}
                  >
                    Return to {crumbs[crumbs.length - 2]?.label}
                  </Link>
                </>
              )}
            </>
          )}
        </Breadcrumbs>
      )}
    </div>
  );
};

export default MrBreadcrumbs;
