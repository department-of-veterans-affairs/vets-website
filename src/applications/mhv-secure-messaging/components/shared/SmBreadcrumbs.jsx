import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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
  const crumbsList = useSelector(state => state.sm.breadcrumbs.crumbsList);
  const previousPath = useRef(Constants.Breadcrumbs.MESSAGES);
  const [, setPrevPath] = useState(previousPath.current);

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
      setPrevPath(prev => {
        previousPath.current = prev;
        return (
          Constants.Breadcrumbs[locationBasePath.toUpperCase()] ||
          Constants.Breadcrumbs.MESSAGES
        );
      });
    },
    [locationBasePath],
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

  useEffect(
    () => {
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
        dispatch(
          setBreadcrumbs(
            [Constants.Breadcrumbs[locationBasePath.toUpperCase()]],
            location,
            Constants.Breadcrumbs[locationBasePath.toUpperCase()],
          ),
        );
      } else if (path === Constants.Paths.FOLDERS && locationChildPath) {
        dispatch(
          setBreadcrumbs(
            [
              {
                href: `/folders/`,
                label: Constants.Breadcrumbs.FOLDERS.label,
                isRouterLink: true,
              },
              {
                href: `/${locationBasePath}/${locationChildPath}`,
                label: activeFolder.name,
                isRouterLink: true,
              },
            ],
            location,
            {
              href: `/${locationBasePath}/${locationChildPath}`,
              label: activeFolder.name,
              isRouterLink: true,
            },
          ),
        );
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
              href: `${Constants.Paths.FOLDERS}${activeFolder.folderId}`,
              label: `${
                activeFolder.folderId < 1
                  ? activeFolder.name.toLowerCase()
                  : activeFolder.name
              }`,
              isRouterLink: true,
            },
            location,
          ),
        );
      } else {
        dispatch(
          setBreadcrumbs(
            [],
            location,
            Constants.Breadcrumbs[locationBasePath.toUpperCase()],
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

  const handleRoutechange = ({ detail }) => {
    const { href } = detail;
    history.push(href);
  };

  return (
    <div>
      {locationBasePath === 'thread' ||
      locationBasePath === 'reply' ||
      locationBasePath === 'new-message' ? (
        <nav
          aria-label="Breadcrumb"
          smCrumbLabel={crumbs.label}
          className="breadcrumbs vads-u-padding-y--4"
        >
          <span className="sm-breadcrumb-list-item">
            <Link
              to={previousPath.current.href}
              className="vads-u-font-size--md"
            >
              Back to {previousPath.current.label}{' '}
            </Link>
          </span>
        </nav>
      ) : (
        <VaBreadcrumbs
          breadcrumbList={crumbsList}
          label="Breadcrumb"
          home-veterans-affairs
          onRouteChange={handleRoutechange}
          className="small-screen:vads-u-margin-y--2"
          dataTestid="sm-breadcrumb"
          smCrumbLabel={crumbs.label}
          uswds
        />
      )}
    </div>
  );
};

export default SmBreadcrumbs;
