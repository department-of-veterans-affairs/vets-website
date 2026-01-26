import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui/index';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import PropTypes from 'prop-types';
import MessageThread from '../components/MessageThread/MessageThread';
import { retrieveMessageThread } from '../actions/messages';
import MessageThreadHeader from '../components/MessageThreadHeader';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import ReplyForm from '../components/ComposeForm/ReplyForm';
import ComposeForm from '../components/ComposeForm/ComposeForm';
import { PageTitles } from '../util/constants';
import { closeAlert } from '../actions/alerts';
import { getFolders, retrieveFolder } from '../actions/folders';
import { navigateToFolderByFolderId, scrollToTop } from '../util/helpers';
import MessageThreadForPrint from '../components/MessageThread/MessageThreadForPrint';
import useFeatureToggles from '../hooks/useFeatureToggles';
import MessageActionButtons from '../components/MessageActionButtons';

const ThreadDetails = props => {
  const {
    customFoldersRedesignEnabled,
    largeAttachmentsEnabled,
    useCanReplyField,
  } = useFeatureToggles();
  const { threadId: messageId } = useParams();
  const { testing } = props;
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const alertList = useSelector(state => state.sm.alerts?.alertList);
  const recipients = useSelector(state => state.sm.recipients);
  const {
    cannotReply,
    isStale,
    drafts,
    messages,
    threadFolderId,
  } = useSelector(state => state.sm.threadDetails);

  const threadCantReply = useMemo(
    () => {
      return useCanReplyField ? cannotReply : isStale;
    },
    [useCanReplyField, cannotReply, isStale],
  );

  const { folder } = useSelector(state => state.sm.folders);

  const message = messages?.length && messages[0];
  const threadId = message?.threadId;
  const [isCreateNewModalVisible, setIsCreateNewModalVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(testing);
  const [isEditing, setIsEditing] = useState(true);
  const [isSending, setIsSending] = useState(false);

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
      if (isSending === true) {
        scrollToTop();
      }
    },
    [isSending],
  );

  useEffect(
    () => {
      if (!folder && drafts?.length > 0) {
        dispatch(retrieveFolder(threadFolderId));
      }
    },
    [drafts, dispatch, folder, threadFolderId],
  );

  const handleRedirectToFolder = useCallback(
    () => {
      navigateToFolderByFolderId(folder?.folderId || 0, history);
    },
    [folder, history],
  );

  useEffect(
    () => {
      if (messageId) {
        dispatch(retrieveMessageThread(messageId))
          .then(() => {
            setIsLoaded(true);
          })
          .catch(() => {
            handleRedirectToFolder();
          });
      }
      return () => {
        dispatch(closeAlert());
      };
    },
    [dispatch, messageId, location.pathname, handleRedirectToFolder],
  );

  useEffect(
    () => {
      if (!isCreateNewModalVisible) {
        const alertVisible = alertList[alertList?.length - 1];
        const alertSelector =
          folder !== undefined && !alertVisible?.isActive
            ? 'h1'
            : alertVisible?.isActive && 'va-alert';
        setTimeout(() => {
          focusElement(document.querySelector(alertSelector));
        }, 300);
      }
    },
    [alertList, folder, isCreateNewModalVisible, header],
  );

  useEffect(() => {
    if (header.current) {
      focusElement(header.current);
    }
  });

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
        <>
          <va-loading-indicator
            message={
              largeAttachmentsEnabled
                ? 'Do not refresh the page. Sending message...'
                : 'Sending message...'
            }
            data-testid="sending-indicator"
            style={{ display: isSending ? 'block' : 'none' }}
          />
          <div
            className="compose-container"
            style={{ display: isSending && 'none' }}
          >
            <ReplyForm
              cannotReply={threadCantReply}
              drafts={drafts || []}
              header={header}
              messages={messages}
              recipients={recipients}
              replyMessage={messages[0]}
              isCreateNewModalVisible={isCreateNewModalVisible}
              setIsCreateNewModalVisible={setIsCreateNewModalVisible}
              threadId={message?.threadId}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              setIsSending={setIsSending}
            />

            <MessageThreadForPrint messageHistory={messages} />

            <MessageThread isDraftThread messageHistory={messages} />

            {customFoldersRedesignEnabled && (
              <MessageActionButtons
                threadId={threadId}
                message={messages[0]}
                cannotReply={threadCantReply}
                isCreateNewModalVisible={isCreateNewModalVisible}
                setIsCreateNewModalVisible={setIsCreateNewModalVisible}
              />
            )}
          </div>
        </>
      );
    }
    if (drafts?.length === 1 && !messages?.length) {
      updatePageTitle(PageTitles.EDIT_DRAFT_PAGE_TITLE_TAG);
      return (
        <div className="compose-container">
          <ComposeForm
            draft={drafts[0]}
            recipients={recipients}
            pageTitle="Edit draft"
          />
        </div>
      );
    }
    if (messages?.length && !drafts?.length) {
      return (
        <>
          <MessageThreadHeader
            message={messages[0]}
            cannotReply={threadCantReply}
            isCreateNewModalVisible={isCreateNewModalVisible}
            setIsCreateNewModalVisible={setIsCreateNewModalVisible}
            recipients={recipients}
          />

          <MessageThreadForPrint messageHistory={messages} />

          <MessageThread messageHistory={messages} />

          {customFoldersRedesignEnabled && (
            <MessageActionButtons
              threadId={threadId}
              message={messages[0]}
              cannotReply={threadCantReply}
              isCreateNewModalVisible={isCreateNewModalVisible}
              setIsCreateNewModalVisible={setIsCreateNewModalVisible}
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
