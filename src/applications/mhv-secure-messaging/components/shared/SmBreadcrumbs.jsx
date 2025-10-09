import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setBreadcrumbs } from '../../actions/breadcrumbs';
import * as Constants from '../../util/constants';
import { navigateToFolderByFolderId } from '../../util/helpers';
import manifest from '../../manifest.json';

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
  const recentRecipients = useSelector(
    state => state.sm.recipients?.recentRecipients,
  );

  // Use state + sessionStorage to persist entry URL and trigger re-renders
  const [composeEntryUrl, setComposeEntryUrlState] = useState(() =>
    sessionStorage.getItem('sm_composeEntryUrl'),
  );

  const setComposeEntryUrl = url => {
    if (url) {
      sessionStorage.setItem('sm_composeEntryUrl', url);
      setComposeEntryUrlState(url); // Trigger re-render
    }
  };

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

  const pathsUsingBackLink = useMemo(
    () => [
      Constants.Paths.MESSAGE_THREAD,
      Constants.Paths.REPLY,
      Constants.Paths.COMPOSE,
      `${Constants.Paths.COMPOSE}${Constants.Paths.SELECT_HEALTH_CARE_SYSTEM}`,
      `${Constants.Paths.COMPOSE}${Constants.Paths.SELECT_CARE_TEAM}`,
      `${Constants.Paths.COMPOSE}${Constants.Paths.START_MESSAGE}`,
      Constants.Paths.RECENT_CARE_TEAMS,
      Constants.Paths.CONTACT_LIST,
      Constants.Paths.CARE_TEAM_HELP,
      Constants.Paths.DRAFTS,
      Constants.Paths.DELETED,
      `${Constants.Paths.FOLDERS}${locationChildPath}/`,
      `${Constants.Paths.MESSAGE_THREAD}${locationChildPath}/`,
      `${Constants.Paths.REPLY}${locationChildPath}/`,
    ],
    [locationChildPath],
  );

  const crumbPath = `/${locationBasePath}/${
    locationChildPath ? `${locationChildPath}/` : ''
  }`;

  const shortenBreadcrumb = useMemo(
    () => pathsUsingBackLink.includes(crumbPath),
    [pathsUsingBackLink, crumbPath],
  );

  // Determine whether the Recent Care Teams step should be part of the compose flow
  const showRecentCareTeams = useMemo(
    () =>
      recentRecipients !== undefined &&
      recentRecipients?.length > 0 &&
      recentRecipients !== 'error' &&
      recentRecipients !== null,
    [recentRecipients],
  );

  // Validate if a path is a valid folder route - add future folder routes here
  const isValidFolderRoute = path => {
    if (!path) return false;
    return (
      path === Constants.Paths.INBOX ||
      path === Constants.Paths.SENT ||
      path.startsWith(Constants.Paths.FOLDERS)
    );
  };

  const getComposeFlowMap = useCallback(
    () => {
      // Determine where the interstitial page should go back to
      const interstitialBackDestination = isValidFolderRoute(composeEntryUrl)
        ? composeEntryUrl
        : Constants.Paths.INBOX;

      const map = {
        [Constants.Paths.COMPOSE]: interstitialBackDestination,
        // Care team help always goes back to select care team
        [Constants.Paths.CARE_TEAM_HELP]: `${Constants.Paths.COMPOSE}${
          Constants.Paths.SELECT_CARE_TEAM
        }`,
        // Start message goes back to select care team
        [`${Constants.Paths.COMPOSE}${Constants.Paths.START_MESSAGE}`]: `${
          Constants.Paths.COMPOSE
        }${Constants.Paths.SELECT_CARE_TEAM}`,
      };

      if (showRecentCareTeams) {
        // Select care team goes back to recent care teams
        map[`${Constants.Paths.COMPOSE}${Constants.Paths.SELECT_CARE_TEAM}`] =
          Constants.Paths.RECENT_CARE_TEAMS;
        // Recent care teams goes back to interstitial
        map[Constants.Paths.RECENT_CARE_TEAMS] = Constants.Paths.COMPOSE;
      } else {
        // Without recent care teams step, select care team goes back to interstitial
        map[`${Constants.Paths.COMPOSE}${Constants.Paths.SELECT_CARE_TEAM}`] =
          Constants.Paths.COMPOSE;
      }

      return map;
    },
    [showRecentCareTeams, composeEntryUrl],
  );

  const navigateBack = useCallback(
    () => {
      // Build current path including child path if present
      const currentPath = `/${locationBasePath}/${
        locationChildPath ? `${locationChildPath}/` : ''
      }`;

      // Check if current page is in the compose flow
      const composeFlowMap = getComposeFlowMap();
      const composeFlowDestination = composeFlowMap[currentPath];

      if (composeFlowDestination) {
        history.push(composeFlowDestination);
        return;
      }

      // Handle non-compose-flow pages
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
      } else if (crumb?.href === Constants.Paths.FOLDERS) {
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
    [
      activeDraftId,
      getComposeFlowMap,
      crumb?.href,
      history,
      locationBasePath,
      locationChildPath,
      previousUrl,
    ],
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
    },
    [activeFolder, dispatch, locationBasePath, locationChildPath, folderList],
  );

  // Track compose flow entry point
  // When in compose flow and coming from a valid folder, capture that as entry point
  useEffect(
    () => {
      // All compose flow routes start with /new-message/
      const isInComposeFlow = location.pathname.startsWith(
        Constants.Paths.COMPOSE,
      );

      // If in compose flow and previousUrl is a valid folder, set as entry point
      // The folder validation prevents overwriting when navigating within compose flow
      if (
        isInComposeFlow &&
        (previousUrl === Constants.Paths.INBOX ||
          previousUrl === Constants.Paths.SENT ||
          previousUrl?.startsWith(Constants.Paths.FOLDERS))
      ) {
        setComposeEntryUrl(previousUrl);
      }
    },
    [location.pathname, previousUrl],
  );

  const handleRouteChange = ({ detail }) => {
    const { href } = detail;
    history.push(href);
  };

  // Determine the correct back link href based on compose flow logic
  const currentPath = `/${locationBasePath}/${
    locationChildPath ? `${locationChildPath}` : ''
  }`;
  const composeFlowMap = getComposeFlowMap();
  const backLinkHref = composeFlowMap[currentPath] || previousUrl;

  return (
    <div>
      {shortenBreadcrumb ? (
        <nav
          aria-label="Breadcrumb"
          className="breadcrumbs vads-u-padding-y--4"
        >
          <va-link
            back
            text="Back"
            href={`${manifest.rootUrl}${backLinkHref}`}
            onClick={e => {
              e.preventDefault();
              navigateBack();
            }}
            data-testid="sm-breadcrumbs-back"
            data-dd-action-name="Breadcrumb - Back"
          />
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
