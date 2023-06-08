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
        case '/folders/0':
          history.push(Constants.Paths.INBOX);
          break;
        case '/folders/-1':
          history.push(Constants.Paths.SENT);
          break;
        case '/folders/-2':
          history.push(Constants.Paths.DRAFTS);
          break;
        case '/folders/-3':
          history.push(Constants.Paths.DELETED);
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
      const [, locationBasePath, locationChildPath] = location.pathname.split(
        '/',
      );
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
    <div
      className={`breadcrumbs vads-1-row ${
        !crumbs?.label ? 'breadcrumbs--hidden' : ''
      }`}
    >
      <va-breadcrumbs label="Breadcrumb">
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
