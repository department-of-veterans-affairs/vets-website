import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setBreadcrumbs } from '../../actions/breadcrumbs';
import * as Constants from '../../util/constants';
import { navigateToFolderByFolderId } from '../../util/helpers';

// Memoize static arrays to prevent unnecessary re-renders
const PATHS_WITH_SHORT_BREADCRUMB = [
  Constants.Paths.MESSAGE_THREAD,
  Constants.Paths.REPLY,
  Constants.Paths.COMPOSE,
  `${Constants.Paths.COMPOSE}${Constants.Paths.SELECT_HEALTH_CARE_SYSTEM}/`,
  `${Constants.Paths.COMPOSE}${Constants.Paths.START_MESSAGE}/`,
  Constants.Paths.CONTACT_LIST,
  `${Constants.Paths.CARE_TEAM_HELP}/`,
  Constants.Paths.DRAFTS,
  Constants.Paths.DELETED,
];

const PATHS_WITH_BACK_BREADCRUMB = [
  Constants.Paths.COMPOSE,
  `${Constants.Paths.COMPOSE}${Constants.Paths.SELECT_HEALTH_CARE_SYSTEM}/`,
  `${Constants.Paths.COMPOSE}${Constants.Paths.START_MESSAGE}/`,
  Constants.Paths.CONTACT_LIST,
  `${Constants.Paths.CARE_TEAM_HELP}/`,
  Constants.Paths.DRAFTS,
  Constants.Paths.DELETED,
];

const SmBreadcrumbs = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  // Debug: Track re-renders and what causes them
  const renderCount = useRef(0);
  const prevProps = useRef({});

  // Track render causes (remove this in production)
  useEffect(() => {
    renderCount.current += 1;
    const currentProps = {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
    };

    const changes = Object.keys(currentProps).filter(
      key => currentProps[key] !== prevProps.current[key],
    );

    // eslint-disable-next-line no-console
    console.log(`🔄 SmBreadcrumbs render #${renderCount.current}`, {
      changes: changes.length > 0 ? changes : 'props unchanged',
      currentProps,
      prevProps: prevProps.current,
    });

    prevProps.current = currentProps;
  });

  // Combine selectors to reduce the number of subscriptions
  const {
    activeFolder,
    folderList,
    crumb,
    crumbsList,
    previousUrl,
    activeDraftId,
  } = useSelector(state => ({
    activeFolder: state.sm.folders.folder,
    folderList: state.sm.folders.folderList,
    crumb: state.sm.breadcrumbs.list,
    crumbsList: state.sm.breadcrumbs.crumbsList,
    previousUrl: state.sm.breadcrumbs.previousUrl,
    activeDraftId: state.sm.threadDetails?.drafts?.[0]?.messageId,
  }));

  const previousPath = useRef(null);

  const [locationBasePath, locationChildPath] = useMemo(
    () => {
      const pathElements = location.pathname.split('/');
      if (pathElements[0] === '') pathElements.shift();
      return pathElements;
    },
    [location.pathname], // Use pathname specifically instead of entire location object
  );

  const newCrumbsList = useMemo(
    () => {
      return crumbsList
        ?.filter(item => item.label !== 'Messages')
        ?.map(item => ({
          ...item,
          label: `${item?.href !== '/my-health' ? 'Messages: ' : ''}${
            item?.label
          }`,
        }));
    },
    [crumbsList],
  );

  // Memoize path computations to prevent recalculation
  const { shortenBreadcrumb, backBreadcrumb } = useMemo(
    () => {
      const path = `/${locationBasePath}/${
        locationChildPath ? `${locationChildPath}/` : ''
      }`;

      // Create the actual paths with dynamic values
      const dynamicShortPaths = [
        ...PATHS_WITH_SHORT_BREADCRUMB,
        `${Constants.Paths.FOLDERS}${locationChildPath}/`,
        `${Constants.Paths.MESSAGE_THREAD}${locationChildPath}/`,
        `${Constants.Paths.REPLY}${locationChildPath}/`,
      ];

      const dynamicBackPaths = [
        ...PATHS_WITH_BACK_BREADCRUMB,
        `${Constants.Paths.FOLDERS}${locationChildPath}/`,
        `${Constants.Paths.MESSAGE_THREAD}${locationChildPath}/`,
        `${Constants.Paths.REPLY}${locationChildPath}/`,
      ];

      return {
        shortenBreadcrumb: dynamicShortPaths.includes(path),
        backBreadcrumb: dynamicBackPaths.includes(path),
      };
    },
    [locationBasePath, locationChildPath],
  );

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
      } else if (crumb.href === Constants.Paths.FOLDERS) {
        history.push(Constants.Paths.FOLDERS);
      } else if (isSentFolder && !isReplyPath) {
        history.push(Constants.Paths.SENT);
      } else if (isInboxFolder && !isReplyPath) {
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
              )?.name,
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

  const handleRouteChange = useCallback(
    ({ detail }) => {
      const { href } = detail;
      history.push(href);
    },
    [history],
  );

  return (
    <div>
      {shortenBreadcrumb ? (
        <nav
          aria-label="Breadcrumb"
          className="breadcrumbs vads-u-padding-y--4"
        >
          <span className="sm-breadcrumb-list-item">
            {backBreadcrumb ? (
              <va-link
                back
                text="Back"
                href={previousUrl}
                onClick={e => {
                  e.preventDefault();
                  navigateBack();
                }}
                data-testid="sm-breadcrumbs-back"
                data-dd-action-name="Breadcrumb - Back"
              />
            ) : (
              <va-link
                text={`Back to ${crumb.label}`}
                href={crumb.href}
                data-dd-privacy="mask"
                data-dd-action-name="Breadcrumb - Back to"
              />
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
          data-dd-action-name="Breadcrumb"
          uswds
        />
      )}
    </div>
  );
};

export default SmBreadcrumbs;
