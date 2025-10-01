import React, { useCallback, useEffect, useMemo, useRef } from 'react';
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
      `${Constants.Paths.COMPOSE}${Constants.Paths.SELECT_HEALTH_CARE_SYSTEM}/`,
      `${Constants.Paths.COMPOSE}${Constants.Paths.SELECT_CARE_TEAM}/`,
      `${Constants.Paths.COMPOSE}${Constants.Paths.START_MESSAGE}/`,
      `${Constants.Paths.RECENT_CARE_TEAMS}/`,
      Constants.Paths.CONTACT_LIST,
      `${Constants.Paths.CARE_TEAM_HELP}/`,
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
  // Mirrors the conditional logic used in RecentCareTeams.jsx for when recent care teams are NOT available
  const showRecentCareTeams = useMemo(
    () =>
      recentRecipients !== undefined &&
      recentRecipients?.length > 0 &&
      recentRecipients !== 'error' &&
      recentRecipients !== null,
    [recentRecipients],
  );

  // List of compose wizard pages that should not be valid back destinations from interstitial
  const composeWizardPages = useMemo(
    () => [
      Constants.Paths.RECENT_CARE_TEAMS,
      `${Constants.Paths.COMPOSE}${Constants.Paths.SELECT_CARE_TEAM}`,
      `${Constants.Paths.COMPOSE}${Constants.Paths.START_MESSAGE}`,
      Constants.Paths.CARE_TEAM_HELP,
      Constants.Paths.CONTACT_LIST,
    ],
    [],
  );

  // Compose flow navigation map - defines explicit back button destinations
  // Conditionally includes RECENT_CARE_TEAMS only when present
  const composeFlowMap = useMemo(
    () => {
      const map = {
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

      // Interstitial exits the flow - go to previousUrl, but skip compose wizard pages
      const isComposeWizardPage = composeWizardPages.some(page =>
        previousUrl?.startsWith(page),
      );

      map[Constants.Paths.COMPOSE] =
        !previousUrl || isComposeWizardPage
          ? Constants.Paths.INBOX
          : previousUrl;

      return map;
    },
    [showRecentCareTeams, previousUrl, composeWizardPages],
  );

  const navigateBack = useCallback(
    () => {
      const { pathname } = location;

      // Check if current page is in the compose flow
      const composeFlowDestination = composeFlowMap[pathname];

      if (composeFlowDestination) {
        // We're in the compose flow - use the mapped destination
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
      const wasSelectCareTeam = previousUrl.includes(
        Constants.Paths.SELECT_CARE_TEAM,
      );

      if (isContactList && isCompose && activeDraftId) {
        history.push(`${Constants.Paths.MESSAGE_THREAD}${activeDraftId}/`);
      } else if (crumb.href === Constants.Paths.FOLDERS) {
        history.push(Constants.Paths.FOLDERS);
      } else if (isSentFolder && !isReplyPath) {
        history.push(Constants.Paths.SENT);
      } else if (isInboxFolder && !isReplyPath) {
        history.push(Constants.Paths.INBOX);
      } else if (wasSelectCareTeam) {
        history.push(Constants.Paths.INBOX);
      } else {
        // Default: go to previousUrl, but skip contact list (redirect to inbox instead)
        history.push(
          previousUrl !== Constants.Paths.CONTACT_LIST
            ? previousUrl
            : Constants.Paths.INBOX,
        );
      }
    },
    [
      activeDraftId,
      composeFlowMap,
      crumb?.href,
      history,
      locationBasePath,
      previousUrl,
      location,
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

      previousPath.current = path;
    },
    [activeFolder, dispatch, locationBasePath, locationChildPath, folderList],
  );

  const handleRouteChange = ({ detail }) => {
    const { href } = detail;
    history.push(href);
  };

  // Determine the correct back link href based on compose flow logic
  const backLinkHref = useMemo(
    () => {
      const { pathname } = location;
      const destination = composeFlowMap[pathname];
      // Use the mapped destination if in compose flow, otherwise use previousUrl
      return destination || previousUrl;
    },
    [location, composeFlowMap, previousUrl],
  );

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
