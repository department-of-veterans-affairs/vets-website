import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  useLocation,
  useParams,
  useNavigate,
} from 'react-router-dom-v5-compat';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { addUserProperties } from '@department-of-veterans-affairs/mhv/exports';

import { clearThread } from '../actions/threadDetails';
import { getListOfThreads } from '../actions/threads';
import { closeAlert } from '../actions/alerts';
import { getPatientSignature } from '../actions/preferences';
import { retrieveMessageThread } from '../actions/messages';

import ComposeForm from '../components/ComposeForm/ComposeForm';
import InterstitialPage from './InterstitialPage';
import BlockedTriageGroupAlert from '../components/shared/BlockedTriageGroupAlert';
import {
  PageTitles,
  Paths,
  BlockedTriageAlertStyles,
  DefaultFolders,
  threadSortingOptions,
  ParentComponent,
} from '../util/constants';
import { getRecentThreads } from '../util/threads';
import { getUniqueTriageGroups } from '../util/recipients';

const Compose = ({ skipInterstitial }) => {
  const dispatch = useDispatch();
  const recipients = useSelector(state => state.sm.recipients);
  const { drafts, saveError } = useSelector(state => state.sm.threadDetails);
  const signature = useSelector(state => state.sm.preferences.signature);
  const { noAssociations } = useSelector(state => state.sm.recipients);

  const { threadList, isLoading, hasError: hasThreadListError } = useSelector(
    state => state.sm.threads,
  );

  const draftMessage = drafts?.[0] ?? null;
  const { draftId } = useParams();
  const { allTriageGroupsBlocked } = recipients;

  const [acknowledged, setAcknowledged] = useState(skipInterstitial);
  const [draftType, setDraftType] = useState('');
  const [pageTitle, setPageTitle] = useState('Start a new message');
  const location = useLocation();
  const navigate = useNavigate();
  const isDraftPage = location.pathname.includes('/draft');
  const header = useRef();
  const previousPathRef = useRef(location.pathname);

  useEffect(
    () => {
      if (location.pathname.startsWith(Paths.COMPOSE)) {
        dispatch(clearThread());
        setDraftType('compose');
      } else {
        dispatch(retrieveMessageThread(draftId));
      }
    },
    [dispatch, draftId, location.pathname],
  );

  // React to location changes and clear thread if not navigating to contact list
  useEffect(
    () => {
      const currentPath = location.pathname;

      if (
        previousPathRef.current !== currentPath &&
        currentPath !== Paths.CONTACT_LIST
      ) {
        dispatch(clearThread());
      }

      previousPathRef.current = currentPath;
    },
    [location, dispatch],
  );

  useEffect(
    () => {
      if (!signature) {
        dispatch(getPatientSignature());
      }
    },
    [signature, dispatch],
  );

  useEffect(
    () => {
      if (draftMessage?.messageId && draftMessage.draftDate === null) {
        navigate(Paths.INBOX);
      }
      return () => {
        if (isDraftPage) {
          dispatch(closeAlert());
        }
      };
    },
    [isDraftPage, draftMessage, navigate, dispatch],
  );

  useEffect(
    () => {
      if (isDraftPage) {
        setPageTitle('Edit draft');
      }
    },
    [isDraftPage],
  );

  useEffect(
    () => {
      if (acknowledged && header) focusElement(document.querySelector('h1'));
      document.title = `${pageTitle} ${PageTitles.DEFAULT_PAGE_TITLE_TAG}`;
    },
    [header, acknowledged, pageTitle],
  );
  // make sure the thread list is fetched when navigating to the compose page
  useEffect(
    () => {
      const shouldLoadSentFolder = () => {
        const isThreadListEmpty = !threadList;
        const didThreadListError = hasThreadListError;
        const isFirstThreadNotSentFolder =
          threadList?.[0]?.folderId !== DefaultFolders.SENT.id;
        return (
          !isLoading &&
          !didThreadListError &&
          (isThreadListEmpty || isFirstThreadNotSentFolder)
        );
      };

      const loadSentFolder = () => {
        dispatch(
          getListOfThreads(
            DefaultFolders.SENT.id,
            100,
            1,
            threadSortingOptions.SENT_DATE_DESCENDING.value,
            false,
          ),
        );
      };
      if (shouldLoadSentFolder()) {
        loadSentFolder();
      }
    },
    [dispatch, hasThreadListError, isLoading, threadList],
  );

  useEffect(
    () => {
      if (threadList?.length > 0 && !isLoading && recipients) {
        const groups = getUniqueTriageGroups(threadList);
        const recentMessages = getRecentThreads(threadList);
        const dataForDataDog = {
          allowedSMRecipients: recipients.allowedRecipients.length,
          countOfSentMessagesInTheLastSixMonths: recentMessages.length || 0,
          uniqueRecentTriageGroups: groups.length,
        };
        addUserProperties({
          ...dataForDataDog,
        });
      }
    },
    [threadList, isLoading, recipients],
  );

  const content = () => {
    if (!isDraftPage && recipients) {
      return (
        <>
          <ComposeForm
            pageTitle={pageTitle}
            headerRef={header}
            draft={draftMessage}
            recipients={!recipients.error && recipients}
            signature={signature}
          />
        </>
      );
    }

    if (saveError) {
      return (
        <va-alert status="error" visible class="vads-u-margin-y--9">
          <h2 slot="headline">We’re sorry. Something went wrong on our end</h2>
          <p>
            You can’t view your secure message because something went wrong on
            our end. Please check back soon.
          </p>
        </va-alert>
      );
    }

    return null;
  };

  return (
    <>
      {!draftType && (
        <va-loading-indicator
          message="Loading your secure message..."
          setFocus
          data-testid="loading-indicator"
        />
      )}

      {draftType &&
        (noAssociations || allTriageGroupsBlocked) && (
          <div className="vads-l-grid-container compose-container">
            <h1>Start a new message</h1>
            <BlockedTriageGroupAlert
              alertStyle={
                allTriageGroupsBlocked
                  ? BlockedTriageAlertStyles.WARNING
                  : BlockedTriageAlertStyles.INFO
              }
              parentComponent={ParentComponent.COMPOSE}
            />
          </div>
        )}

      {draftType &&
      !acknowledged &&
      (noAssociations === (undefined || false) && !allTriageGroupsBlocked) ? (
        <InterstitialPage
          acknowledge={() => {
            setAcknowledged(true);
          }}
          type={draftType}
        />
      ) : (
        <>
          {draftType &&
            (noAssociations === (undefined || false) &&
              !allTriageGroupsBlocked) && (
              <div className="vads-l-grid-container compose-container">
                {content()}
              </div>
            )}
        </>
      )}
    </>
  );
};

Compose.propTypes = {
  skipInterstitial: PropTypes.bool,
};

Compose.defaultProps = {
  skipInterstitial: false,
};

export default Compose;
