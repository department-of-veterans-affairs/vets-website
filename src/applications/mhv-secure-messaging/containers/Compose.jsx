import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams, useHistory } from 'react-router-dom';
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
import featureToggles from '../hooks/useFeatureToggles';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';

const Compose = () => {
  const { mhvSecureMessagingCuratedListFlow } = featureToggles();

  const dispatch = useDispatch();
  const recipients = useSelector(state => state.sm.recipients);
  const { drafts, saveError, acceptInterstitial } = useSelector(
    state => state.sm.threadDetails,
  );
  const signature = useSelector(state => state.sm.preferences.signature);
  const { noAssociations } = useSelector(state => state.sm.recipients);

  const { threadList, isLoading, hasError: hasThreadListError } = useSelector(
    state => state.sm.threads,
  );

  const draftMessage = drafts?.[0] ?? null;
  const { draftId } = useParams();
  const { allTriageGroupsBlocked } = recipients;

  const [draftType, setDraftType] = useState('');
  const [pageTitle, setPageTitle] = useState(
    mhvSecureMessagingCuratedListFlow ? 'Start message' : 'Start a new message',
  );
  const location = useLocation();
  const history = useHistory();
  const isDraftPage = location.pathname.includes('/draft');

  useEffect(
    () => {
      const composePathNoSlash = Paths.COMPOSE.endsWith('/')
        ? Paths.COMPOSE.slice(0, -1)
        : Paths.COMPOSE;
      if (location.pathname.startsWith(composePathNoSlash)) {
        dispatch(clearThread());
        setDraftType('compose');
      } else if (draftId) {
        dispatch(retrieveMessageThread(draftId));
      }

      const checkNextPath = history.listen(nextPath => {
        if (nextPath.pathname !== Paths.CONTACT_LIST) {
          dispatch(clearThread());
        }
      });
      return () => {
        checkNextPath();
      };
    },
    [dispatch, draftId, history, location.pathname],
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
        history.push(Paths.INBOX);
      }
      return () => {
        if (isDraftPage) {
          dispatch(closeAlert());
        }
      };
    },
    [isDraftPage, draftMessage, history, dispatch],
  );

  useEffect(
    () => {
      if (isDraftPage) {
        setPageTitle('Edit draft');
      }
    },
    [isDraftPage],
  );

  const headerText = document.querySelector('h1')?.textContent;
  useEffect(
    () => {
      document.title = `${headerText} ${PageTitles.DEFAULT_PAGE_TITLE_TAG}`;
    },
    [headerText],
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
      !acceptInterstitial &&
      (noAssociations === (undefined || false) && !allTriageGroupsBlocked) ? (
        <InterstitialPage type={draftType} />
      ) : (
        <>
          {draftType &&
            (noAssociations === (undefined || false) &&
              !allTriageGroupsBlocked) && (
              <div className="vads-l-grid-container compose-container">
                <AlertBackgroundBox closeable />
                {content()}
              </div>
            )}
        </>
      )}
    </>
  );
};

export default Compose;
