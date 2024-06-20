import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setBreadcrumbs } from '../../actions/breadcrumbs';
import * as Constants from '../../util/constants';
import { navigateToFolderByFolderId } from '../../util/helpers';

const SmBreadcrumbs = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const activeFolder = useSelector(state => state.sm.folders.folder);
  const folderList = useSelector(state => state.sm.folders.folderList);
  const crumb = useSelector(state => state.sm.breadcrumbs.list);
  const crumbsList = useSelector(state => state.sm.breadcrumbs.crumbsList);
  const previousPath = useRef(null);

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
      const path = locationBasePath ? `/${locationBasePath}/` : '/';

      if (
        (path === Constants.Paths.MESSAGE_THREAD ||
          path === Constants.Paths.REPLY) &&
        !activeFolder
      ) {
        dispatch(
          setBreadcrumbs([
            {
              ...Constants.Breadcrumbs.INBOX,
              label: 'inbox',
            },
          ]),
        );
      } else if (
        [
          Constants.Paths.INBOX,
          Constants.Paths.SENT,
          Constants.Paths.DELETED,
          Constants.Paths.DRAFTS,
        ].includes(path) ||
        (path === Constants.Paths.FOLDERS && !locationChildPath)
      ) {
        dispatch(
          setBreadcrumbs([
            Constants.Breadcrumbs[locationBasePath.toUpperCase()],
          ]),
        );
      } else if (
        path === Constants.Paths.FOLDERS &&
        locationChildPath &&
        activeFolder &&
        folderList
      ) {
        dispatch(
          setBreadcrumbs([
            {
              href: `/folders/`,
              label: Constants.Breadcrumbs.FOLDERS.label,
              isRouterLink: true,
            },
            {
              href: `/${locationBasePath}/${locationChildPath}`,
              label: folderList.find(
                item => item.id === parseInt(locationChildPath, 10),
              ).name,
              isRouterLink: true,
            },
          ]),
        );
      } else if (
        activeFolder &&
        (path === Constants.Paths.MESSAGE_THREAD ||
          path === Constants.Paths.REPLY)
      ) {
        dispatch(
          setBreadcrumbs([
            {
              href: `${Constants.Paths.FOLDERS}${activeFolder.folderId}`,
              label: `${
                activeFolder.folderId < 1
                  ? activeFolder.name.toLowerCase()
                  : activeFolder.name
              }`,
              isRouterLink: true,
            },
          ]),
        );
      } else {
        dispatch(setBreadcrumbs([]));
      }

      previousPath.current = path;
    },
    [activeFolder, dispatch, locationBasePath, locationChildPath, folderList],
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
          smCrumbLabel={crumb.label}
          className="breadcrumbs vads-u-padding-y--4"
        >
          <span className="sm-breadcrumb-list-item">
            {locationBasePath === 'new-message' ? (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <Link
                to="#"
                onClick={e => {
                  e.preventDefault();
                  history.goBack();
                }}
                className="vads-u-font-size--md"
              >
                Back
              </Link>
            ) : (
              <Link to={crumb.href} className="vads-u-font-size--md">
                {`Back to ${crumb.label}`}
              </Link>
            )}
          </span>
        </nav>
      ) : (
        <VaBreadcrumbs
          breadcrumbList={crumbsList}
          label="Breadcrumb"
          home-veterans-affairs
          onRouteChange={handleRoutechange}
          className="small-screen:vads-u-margin-y--2"
          dataTestid="sm-breadcrumbs"
          smCrumbLabel={crumb.label}
          uswds
        />
      )}
    </div>
  );
};

export default SmBreadcrumbs;
