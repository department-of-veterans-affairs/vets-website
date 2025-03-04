import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
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
  const previousUrl = useSelector(state => state.sm.breadcrumbs.previousUrl);
  const activeDraftId = useSelector(
    state => state.sm.threadDetails?.drafts?.[0]?.messageId,
  );
  const removeLandingPageFF = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvSecureMessagingRemoveLandingPage
      ],
  );

  const previousPath = useRef(null);

  const [locationBasePath, locationChildPath] = useMemo(
    () => {
      const pathElements = location.pathname.split('/');
      if (pathElements[0] === '') pathElements.shift();
      return pathElements;
    },
    [location],
  );

  const newCrumbsList = useMemo(
    () => {
      let updatedCrumbsList = crumbsList;

      if (removeLandingPageFF) {
        updatedCrumbsList = updatedCrumbsList?.filter(
          item => item.label !== 'Messages',
        );
      }

      return updatedCrumbsList?.map(item => ({
        ...item,
        ...(removeLandingPageFF
          ? {
              label: `${item?.href !== '/my-health' ? 'Messages: ' : ''}${
                item?.label
              }`,
            }
          : {}),
      }));
    },
    [crumbsList, removeLandingPageFF],
  );

  const pathsWithShortBreadcrumb = [
    Constants.Paths.MESSAGE_THREAD,
    Constants.Paths.REPLY,
    Constants.Paths.COMPOSE,
    Constants.Paths.CONTACT_LIST,
    Constants.Paths.DRAFTS,
    Constants.Paths.DELETED,
    ...(removeLandingPageFF
      ? [
          `${Constants.Paths.FOLDERS}${locationChildPath}/`,
          `${Constants.Paths.MESSAGE_THREAD}${locationChildPath}/`,
          `${Constants.Paths.REPLY}${locationChildPath}/`,
        ]
      : []),
  ];
  const pathsWithBackBreadcrumb = [
    Constants.Paths.COMPOSE,
    Constants.Paths.CONTACT_LIST,
    Constants.Paths.DRAFTS,
    Constants.Paths.DELETED,
    ...(removeLandingPageFF
      ? [
          `${Constants.Paths.FOLDERS}${locationChildPath}/`,
          `${Constants.Paths.MESSAGE_THREAD}${locationChildPath}/`,
          `${Constants.Paths.REPLY}${locationChildPath}/`,
        ]
      : []),
  ];

  const crumbPath = `/${locationBasePath}/${
    removeLandingPageFF && locationChildPath ? `${locationChildPath}/` : ''
  }`;
  const shortenBreadcrumb = pathsWithShortBreadcrumb.includes(crumbPath);
  const backBreadcrumb = pathsWithBackBreadcrumb.includes(crumbPath);

  const navigateBack = useCallback(
    () => {
      const isContactList =
        `/${locationBasePath}/` === Constants.Paths.CONTACT_LIST;

      const isCompose = previousUrl === Constants.Paths.COMPOSE;
      const isSentFolder =
        crumb?.href ===
        `${Constants.Paths.FOLDERS}${Constants.DefaultFolders.SENT.id}`;
      const isInboxFolder =
        crumb?.href ===
        `${Constants.Paths.FOLDERS}${Constants.DefaultFolders.INBOX.id}`;
      const isReplyPath = `/${locationBasePath}/` === Constants.Paths.REPLY;

      if (isContactList && isCompose && activeDraftId) {
        history.push(`${Constants.Paths.MESSAGE_THREAD}${activeDraftId}/`);
      } else if (
        removeLandingPageFF &&
        crumb.href === Constants.Paths.FOLDERS
      ) {
        history.push(Constants.Paths.FOLDERS);
      } else if (removeLandingPageFF && isSentFolder && !isReplyPath) {
        history.push(Constants.Paths.SENT);
      } else if (removeLandingPageFF && isInboxFolder && !isReplyPath) {
        history.push(Constants.Paths.INBOX);
      } else {
        history.push(
          previousUrl !== Constants.Paths.CONTACT_LIST
            ? previousUrl
            : Constants.Paths.INBOX,
        );
      }
    },
    [activeDraftId, crumb?.href, history, locationBasePath, previousUrl],
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
        [Constants.Paths.INBOX, Constants.Paths.SENT].includes(path) ||
        (path === Constants.Paths.FOLDERS && !locationChildPath)
      ) {
        dispatch(
          setBreadcrumbs([
            Constants.Breadcrumbs[locationBasePath.toUpperCase()],
          ]),
        );
      } else if (
        [Constants.Paths.DELETED, Constants.Paths.DRAFTS].includes(path) ||
        (path === Constants.Paths.FOLDERS && !locationChildPath)
      ) {
        dispatch(
          setBreadcrumbs([
            {
              href: Constants.Paths.FOLDERS,
              label: Constants.Breadcrumbs.FOLDERS.label,
              isRouterLink: true,
            },
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
              href: Constants.Paths.FOLDERS,
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

  const handleRouteChange = ({ detail }) => {
    const { href } = detail;
    history.push(href);
  };

  return (
    <div>
      {shortenBreadcrumb ? (
        <nav
          aria-label="Breadcrumb"
          className="breadcrumbs vads-u-padding-y--4"
        >
          <span className="sm-breadcrumb-list-item">
            <va-icon
              icon="arrow_back"
              size={1}
              style={{ position: 'relative', top: '-5px', left: '-1px' }}
              class="vads-u-color--gray-medium"
            />
            {backBreadcrumb ? (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <Link
                to="#"
                onClick={e => {
                  e.preventDefault();
                  navigateBack();
                }}
                className="vads-u-font-size--md"
                data-testid="sm-breadcrumbs-back"
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
          breadcrumbList={newCrumbsList}
          label="Breadcrumb"
          home-veterans-affairs
          onRouteChange={handleRouteChange}
          className="mobile-lg:vads-u-margin-y--2"
          dataTestid="sm-breadcrumbs"
          uswds
        />
      )}
    </div>
  );
};

export default SmBreadcrumbs;
