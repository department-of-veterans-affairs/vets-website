import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui/index';
import PropTypes from 'prop-types';
import MessageThread from '../components/MessageThread/MessageThread';
import { retrieveMessageThread } from '../actions/messages';
import MessageDetailBlock from '../components/MessageDetailBlock';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import ReplyForm from '../components/ComposeForm/ReplyForm';
import EmergencyNote from '../components/EmergencyNote';
import ComposeForm from '../components/ComposeForm/ComposeForm';
import { getTriageTeams } from '../actions/triageTeams';
import { clearDraft } from '../actions/draftDetails';
import InterstitialPage from './InterstitialPage';
import { PrintMessageOptions, PageTitles } from '../util/constants';
import { closeAlert } from '../actions/alerts';
import { navigateToFolderByFolderId, updatePageTitle } from '../util/helpers';
import { retrieveFolder } from '../actions/folders';

const ThreadDetails = props => {
  const { threadId } = useParams();
  const { testing } = props;
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const { triageTeams } = useSelector(state => state.sm.triageTeams);
  const {
    message,
    messageHistory,
    printOption,
    threadViewCount,
    cannotReply,
  } = useSelector(state => state.sm.messageDetails);
  const { draftMessage, draftMessageHistory } = useSelector(
    state => state.sm.draftDetails,
  );
  const { folder } = useSelector(state => state.sm.folders);

  const [isMessage, setIsMessage] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [isLoaded, setIsLoaded] = useState(testing);
  const [acknowledged, setAcknowledged] = useState(false);
  const [h1Focus, setH1Focus] = useState(false);
  const header = useRef(h1Focus);

  // necessary to update breadcrumb when there is no active folder in redux store, which happens when user lands on the threadDetails view from the url instead of the parent folder.
  useEffect(
    () => {
      if (!folder && draftMessage) {
        dispatch(retrieveFolder(draftMessage?.threadFolderId));
      }
    },
    [draftMessage, dispatch, folder],
  );

  useEffect(
    () => {
      if (threadId) {
        dispatch(getTriageTeams());
        dispatch(retrieveMessageThread(threadId))
          .then(() => {
            setIsLoaded(true);
          })
          .catch(() => {
            navigateToFolderByFolderId(folder?.folderId || 0, history);
          });
      }
      return () => {
        dispatch(clearDraft());
        dispatch(closeAlert());
      };
    },
    [dispatch, threadId, location.pathname],
  );

  useEffect(
    () => {
      if (isLoaded) {
        if (draftMessage?.messageId) {
          if (draftMessageHistory?.length > 0) {
            setIsReply(true);
          } else {
            setIsDraft(true);
          }
        } else if (message?.messageId) {
          setIsMessage(true);
        }
      }
    },
    [message, draftMessage, draftMessageHistory, isLoaded],
  );

  useEffect(
    () => {
      focusElement(header.current);
    },
    [header],
  );

  useEffect(
    () => {
      if (isDraft || isReply) {
        setH1Focus(true);
        focusElement(header.current);
        updatePageTitle(PageTitles.EDIT_DRAFT_PAGE_TITLE_TAG);
      }
    },
    [acknowledged],
  );

  const content = () => {
    if (!isLoaded) {
      return (
        <va-loading-indicator
          message="Loading your secure message..."
          setFocus
        />
      );
    }
    if (!acknowledged && (isReply || isDraft)) {
      return (
        <InterstitialPage
          acknowledge={() => {
            setAcknowledged(true);
          }}
          type={isReply ? 'reply' : isDraft && 'draft'}
        />
      );
    }
    if (isReply && draftMessageHistory !== undefined) {
      return (
        <div className="compose-container">
          <ReplyForm
            draftToEdit={draftMessage}
            replyMessage={draftMessageHistory[0]}
            cannotReply={cannotReply}
            header={header}
          />
          <MessageThread
            messageHistory={draftMessageHistory.slice(1)}
            isDraftThread
            isForPrint={printOption === PrintMessageOptions.PRINT_THREAD}
            viewCount={threadViewCount}
          />
        </div>
      );
    }
    if (isDraft) {
      return (
        <div className="compose-container">
          <h1 className="page-title" ref={header}>
            Edit draft
          </h1>
          <EmergencyNote dropDownFlag />

          <ComposeForm draft={draftMessage} recipients={triageTeams} />
        </div>
      );
    }
    if (isMessage) {
      return (
        <>
          <MessageDetailBlock message={message} cannotReply={cannotReply} />
          {messageHistory?.length > 0 && (
            <MessageThread
              messageHistory={messageHistory}
              threadId={threadId}
              isForPrint={printOption === PrintMessageOptions.PRINT_THREAD}
              viewCount={threadViewCount}
            />
          )}
        </>
      );
    }
    if (message !== undefined && message === null) {
      <va-alert status="error" visible class="vads-u-margin-y--9">
        <h2 slot="headline">We’re sorry. Something went wrong on our end</h2>
        <p>
          You can’t view your secure message because something went wrong on our
          end. Please check back soon.
        </p>
      </va-alert>;
    }
    return null;
  };

  return (
    <div className="vads-l-grid-container message-detail-container">
      {/* Only display alerts after acknowledging the Interstitial page or if this thread does not contain drafts */}
      <AlertBackgroundBox closeable />

      {content()}
    </div>
  );
};

ThreadDetails.propTypes = {
  testing: PropTypes.bool,
};

export default ThreadDetails;
