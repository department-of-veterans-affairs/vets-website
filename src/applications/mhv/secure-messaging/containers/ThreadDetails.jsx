import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  // useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui/index';
import PropTypes from 'prop-types';
import MessageThread from '../components/MessageThread/MessageThread';
import { retrieveMessageThread } from '../actions/messages';
import MessageThreadHeader from '../components/MessageThreadHeader';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import ReplyForm from '../components/ComposeForm/ReplyForm';
import ComposeForm from '../components/ComposeForm/ComposeForm';
import { getTriageTeams } from '../actions/triageTeams';
import { clearDraft } from '../actions/draftDetails';
import {
  PrintMessageOptions,
  // PageTitles
} from '../util/constants';
import { closeAlert } from '../actions/alerts';
// import { navigateToFolderByFolderId, updatePageTitle } from '../util/helpers';
import { getFolders, retrieveFolder } from '../actions/folders';

const ThreadDetails = props => {
  const { threadId } = useParams();
  const { testing } = props;
  const dispatch = useDispatch();
  const location = useLocation();

  // const history = useHistory();
  const alertList = useSelector(state => state.sm.alerts?.alertList);
  const { triageTeams } = useSelector(state => state.sm.triageTeams);
  const {
    message,
    // messageHistory,
    printOption,
    // threadViewCount,
    // cannotReply,
  } = useSelector(state => state.sm.messageDetails);
  // const { draftMessage } = useSelector(state => state.sm.draftDetails);
  const {
    drafts,
    messages,
    cannotReply,
    threadFolderId,
    threadViewCount,
  } = useSelector(state => state.sm.threadDetails);
  const { folder } = useSelector(state => state.sm.folders);

  const [isCreateNewModalVisible, setIsCreateNewModalVisible] = useState(false);

  const [isLoaded, setIsLoaded] = useState(testing);
  const header = useRef();

  // necessary to update breadcrumb when there is no active folder in redux store, which happens when user lands on the threadDetails view from the url instead of the parent folder.
  useEffect(
    () => {
      dispatch(getFolders());
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (!folder && drafts?.length > 0) {
        dispatch(retrieveFolder(threadFolderId));
      }
    },
    [drafts, dispatch, folder, threadFolderId],
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
            // navigateToFolderByFolderId(folder?.folderId || 0, history);
          });
      }
      return () => {
        dispatch(clearDraft());
        dispatch(closeAlert());
      };
    },
    [dispatch, threadId, location.pathname],
  );

  // useEffect(
  //   () => {
  //     if (isLoaded) {
  //       if (draftMessage?.messageId) {
  //         if (draftMessageHistory?.length > 0) {
  //           setIsReply(true);
  //         } else {
  //           setIsDraft(true);
  //         }
  //         updatePageTitle(PageTitles.EDIT_DRAFT_PAGE_TITLE_TAG);
  //       } else if (message?.messageId) {
  //         setIsMessage(true);
  //       }
  //     }
  //   },
  //   [message, draftMessage, draftMessageHistory, isLoaded],
  // );

  useEffect(
    () => {
      if (!isCreateNewModalVisible) {
        const alertVisible = alertList[alertList?.length - 1];
        const alertSelector =
          folder !== undefined && !alertVisible?.isActive
            ? 'h1'
            : alertVisible?.isActive && 'va-alert';
        focusElement(document.querySelector(alertSelector));
      }
    },
    [alertList, folder, isCreateNewModalVisible],
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

    if (drafts?.length > 0 && messages?.length > 0) {
      return (
        <div className="compose-container">
          <ReplyForm
            // draftToEdit={drafts[0]}
            drafts={drafts}
            replyMessage={messages[0]}
            cannotReply={cannotReply}
            header={header}
          />
          <MessageThread
            messageHistory={messages}
            isDraftThread
            isForPrint={printOption === PrintMessageOptions.PRINT_THREAD}
            viewCount={threadViewCount}
          />
        </div>
      );
    }
    if (drafts?.length === 1 && !messages?.length) {
      return (
        <div className="compose-container">
          <h1 className="page-title vads-u-margin-top--0" ref={header}>
            Edit draft
          </h1>
          <ComposeForm draft={drafts[0]} recipients={triageTeams} />
        </div>
      );
    }
    if (messages?.length && !drafts?.length) {
      return (
        <>
          <MessageThreadHeader
            message={messages[0]}
            cannotReply={cannotReply}
            isCreateNewModalVisible={isCreateNewModalVisible}
            setIsCreateNewModalVisible={setIsCreateNewModalVisible}
          />
          <MessageThread
            messageHistory={messages}
            threadId={threadId}
            isForPrint={printOption === PrintMessageOptions.PRINT_THREAD}
            viewCount={threadViewCount}
          />
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
    <div className="message-detail-container">
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
