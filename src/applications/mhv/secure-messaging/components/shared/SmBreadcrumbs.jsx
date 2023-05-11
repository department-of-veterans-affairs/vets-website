import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
// temporarily using deprecated Breadcrumbs React component due to issues with VaBreadcrumbs that are pending resolution
// import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
// import { replaceWithStagingDomain } from '~/platform/utilities/environment/stagingDomains';
import { setBreadcrumbs } from '../../actions/breadcrumbs';
import * as Constants from '../../util/constants';

const SmBreadcrumbs = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const messageDetails = useSelector(state => state.sm.messageDetails.message);
  const activeFolder = useSelector(state => state.sm.folders.folder);
  const breadcrumbsRef = useRef();
  const crumbs = useSelector(state => state.sm.breadcrumbs.list);
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
      const arr = [{ path: '/', label: 'Dashboard' }];
      let paths = [
        { path: `/message`, label: messageDetails?.subject },
        { path: '/reply', label: messageDetails?.subject },
        Constants.Breadcrumbs.COMPOSE,
        Constants.Breadcrumbs.DRAFT,
        Constants.Breadcrumbs.DRAFTS,
        Constants.Breadcrumbs.INBOX,
        Constants.Breadcrumbs.FOLDERS,
        Constants.Breadcrumbs.SENT,
        Constants.Breadcrumbs.TRASH,
        Constants.Breadcrumbs.FAQ,
      ];

      // Displays folder path with child path
      if (activeFolder?.folderId > 0) {
        const foldersParent = paths.find(({ path }) => path === '/folders');
        const foldersChild = {
          children: [
            {
              path: `/folder/${activeFolder?.folderId}`,
              label: activeFolder?.name,
            },
          ],
        };
        const childPath = foldersChild.children.find(({ path }) => path);
        paths = [...paths];
        Object.assign(foldersParent, foldersChild);

        if (childPath.path !== location.pathname) {
          delete foldersParent.children;
        }
        if (childPath.path === location.pathname) {
          arr.push(foldersParent);
          if (childPath) {
            arr.push(childPath);
          }
        }
      }

      const handleBreadCrumbs = () => {
        // arr.push({
        //   path: replaceWithStagingDomain('https://www.va.gov'),
        //   label: 'VA.gov home',
        // });
        // arr.push({
        //   path: replaceWithStagingDomain('https://www.va.gov/health-care/'),
        //   label: 'My Health',
        // });

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
          } else if (locationBasePath === 'search') {
            arr.push({ path: '/', label: 'Back' });
          } else if (
            locationBasePath === 'reply' &&
            activeFolder?.folderId === 0
          ) {
            arr.push(Constants.Breadcrumbs.INBOX);
          } else if (
            (locationBasePath === 'thread' ||
              locationBasePath === 'reply' ||
              locationBasePath === 'compose') &&
            activeFolder
          ) {
            if (activeFolder.folderId === 0) {
              arr.push({
                path: `${Constants.Breadcrumbs.INBOX.path}`,
                label: activeFolder.name,
              });
            } else {
              arr.push({
                path: `/folder/${activeFolder.folderId}`,
                label: activeFolder.name,
              });
            }
          }
        });
        dispatch(setBreadcrumbs(arr, location));
      };
      handleBreadCrumbs();
    },
    [
      activeFolder?.folderId,
      activeFolder?.name,
      dispatch,
      location,
      messageDetails?.subject,
    ],
  );

  return (
    <div className="vads-l-row breadcrumbs">
      {crumbs.length > 0 && (
        // per exisiting issue found here https://github.com/department-of-veterans-affairs/vets-design-system-documentation/issues/1296
        // eslint-disable-next-line @department-of-veterans-affairs/prefer-web-component-library
        <Breadcrumbs ref={breadcrumbsRef}>
          {isMobile ? (
            crumbs?.map((crumb, i) => {
              if (crumb.path.includes('https://')) {
                return (
                  <a key={i} href={crumb.path}>
                    Return to {crumbs[crumbs.length - 2]?.label.toLowerCase()}
                  </a>
                );
              }
              return (
                <Link key={i} to={crumb.path}>
                  Return to {crumbs[crumbs.length - 2]?.label.toLowerCase()}
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
                    {location.pathname === '/search/results' ? (
                      <>{crumbs[crumbs.length - 2]?.label}</>
                    ) : (
                      <>
                        Return to{' '}
                        {crumbs[crumbs.length - 2]?.label?.toLowerCase()}
                      </>
                    )}
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

export default SmBreadcrumbs;
