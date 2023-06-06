import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { setBreadcrumbs } from '../../actions/breadcrumbs';
import * as Constants from '../../util/constants';
import { retrieveFolder } from '../../actions/folders';

const SmBreadcrumbs = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const messageDetails = useSelector(state => state.sm.messageDetails.message);
  const activeFolder = useSelector(state => state.sm.folders.folder);
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

  useEffect(
    () => {
      switch (location.pathname) {
        case '/folder/0':
          history.push(Constants.Breadcrumbs.INBOX.path);
          break;
        case '/folder/-1':
          history.push(Constants.Breadcrumbs.SENT.path);
          break;
        case '/folder/-2':
          history.push(Constants.Breadcrumbs.DRAFTS.path);
          break;
        case '/folder/-3':
          history.push(Constants.Breadcrumbs.TRASH.path);
          break;
        default:
          break;
      }
    },
    [location.pathname, history],
  );

  window.addEventListener('resize', checkScreenSize);
  useEffect(
    () => {
      const arr = [];
      const paths = [
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
          } else if (locationBasePath === 'folder') {
            arr.push({
              path: Constants.Breadcrumbs.FOLDERS.path,
              label: Constants.Breadcrumbs.FOLDERS.label,
            });
          } else if (locationBasePath === 'search') {
            arr.push({
              path: `/folder/${activeFolder.folderId}`,
              label: 'Back',
            });
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
    [activeFolder, dispatch, location, messageDetails?.subject],
  );

  useEffect(
    () => {
      if (messageDetails && !activeFolder) {
        dispatch(retrieveFolder(messageDetails?.threadFolderId));
      }
    },
    [messageDetails, activeFolder, dispatch],
  );

  const breadcrumbSize = () => {
    if (isMobile) {
      return Constants.BreadcrumbViews.MOBILE_VIEW;
    }
    return Constants.BreadcrumbViews.DESKTOP_VIEW;
  };

  return (
    <div className="breadcrumbs vads-1-row">
      {crumbs.length > 0 &&
        (crumbs.length === 1 ? (
          <>
            <va-breadcrumbs className="sm-breadcrumb">
              <div className={breadcrumbSize()}>
                <span className="breadcrumb-angle vads-u-padding-right--1">
                  {'\u2039'}{' '}
                </span>
                <Link to="/"> Back to messages</Link>
              </div>
            </va-breadcrumbs>
          </>
        ) : (
          crumbs.length > 1 && (
            <>
              <va-breadcrumbs>
                <div className={breadcrumbSize()}>
                  <span className="breadcrumb-angle vads-u-padding-right--1">
                    {'\u2039'}{' '}
                  </span>
                  <Link
                    to={`${crumbs[crumbs.length - 2]?.path?.toLowerCase()}`}
                  >
                    Back to {crumbs[crumbs.length - 2]?.label?.toLowerCase()}
                  </Link>
                </div>
              </va-breadcrumbs>
            </>
          )
        ))}
    </div>
  );
};

export default SmBreadcrumbs;
