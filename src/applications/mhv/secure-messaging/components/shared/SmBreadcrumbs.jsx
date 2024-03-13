import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { setBreadcrumbs } from '../../actions/breadcrumbs';
import * as Constants from '../../util/constants';
import { retrieveFolder } from '../../actions/folders';
import { navigateToFolderByFolderId } from '../../util/helpers';

const SmBreadcrumbs = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const threadDetails = useSelector(state => state.sm.threadDetails);
  const messageDetails = threadDetails.messages?.length
    ? threadDetails.messages[0]
    : null;
  const activeFolder = useSelector(state => state.sm.folders.folder);
  const crumbs = useSelector(state => state.sm.breadcrumbs.list);
  const [isMobile, setIsMobile] = useState(false);

  function checkScreenSize() {
    if (window.innerWidth <= 768 && setIsMobile !== false) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }

  const [locationBasePath, locationChildPath] = useMemo(
    () => {
      const pathElements = location.pathname.split('/');
      if (pathElements[0] === '') pathElements.shift();
      return pathElements;
    },
    [location],
  );

  useEffect(
    () => {
      checkScreenSize();
    },
    [isMobile],
  );

  useEffect(
    () => {
      if (
        `/${locationBasePath}/` === Constants.Paths.FOLDERS &&
        parseInt(locationChildPath, 10) < 1
      ) {
        navigateToFolderByFolderId(locationChildPath, history);
      }
    },
    [locationBasePath, locationChildPath, history],
  );

  window.addEventListener('resize', checkScreenSize);

  useEffect(
    () => {
      if (!locationBasePath) {
        dispatch(setBreadcrumbs({}, location));
        return;
      }

      const path = `/${locationBasePath}/`;

      if (
        [
          Constants.Paths.INBOX,
          Constants.Paths.SENT,
          Constants.Paths.DELETED,
          Constants.Paths.DRAFTS,
        ].includes(path) ||
        (path === Constants.Paths.FOLDERS && !locationChildPath)
      ) {
        dispatch(setBreadcrumbs(Constants.Breadcrumbs.MESSAGES, location));
      } else if (path === Constants.Paths.FOLDERS && locationChildPath) {
        dispatch(setBreadcrumbs(Constants.Breadcrumbs.FOLDERS, location));
      } else if (path === Constants.Paths.COMPOSE) {
        dispatch(setBreadcrumbs(Constants.Breadcrumbs.INBOX, location));
      } else if (
        path ===
          (Constants.Paths.MESSAGE_THREAD ||
            Constants.Paths.REPLY ||
            Constants.Paths.COMPOSE) &&
        activeFolder
      ) {
        dispatch(
          setBreadcrumbs(
            {
              path: `${Constants.Paths.FOLDERS}${activeFolder.folderId}`,
              label: `Back to ${
                activeFolder.folderId < 1
                  ? activeFolder.name.toLowerCase()
                  : activeFolder.name
              }`,
            },
            location,
          ),
        );
      }
    },
    [
      activeFolder,
      dispatch,
      location,
      locationBasePath,
      locationChildPath,
      messageDetails?.subject,
    ],
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
    <div
      className={`breadcrumbs vads-1-row ${
        !crumbs?.label ? 'breadcrumbs--hidden' : ''
      }`}
    >
      <va-breadcrumbs label="Breadcrumb" home-veterans-affairs={false}>
        {crumbs && (
          <ul className={breadcrumbSize()}>
            <li>
              <span className="breadcrumb-angle vads-u-padding-right--1">
                {'\u2039'}{' '}
              </span>
              <Link to={crumbs.path?.toLowerCase()}>{crumbs.label}</Link>
            </li>
          </ul>
        )}
      </va-breadcrumbs>
    </div>
  );
};

export default SmBreadcrumbs;
