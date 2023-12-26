import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui/index';
import PropTypes from 'prop-types';
import MessageThread from '../components/MessageThread/MessageThread';
import { retrieveMessageThread } from '../actions/messages';
import MessageThreadHeader from '../components/MessageThreadHeader';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import ReplyForm from '../components/ComposeForm/ReplyForm';
import ComposeForm from '../components/ComposeForm/ComposeForm';
import { PageTitles, PrintMessageOptions } from '../util/constants';
import { closeAlert } from '../actions/alerts';
import { getFolders, retrieveFolder } from '../actions/folders';
import { navigateToFolderByFolderId, updatePageTitle } from '../util/helpers';

const ThreadDetails = props => {
  const { threadId } = useParams();
  const { testing } = props;
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const alertList = useSelector(state => state.sm.alerts?.alertList);
  const { recipients } = useSelector(state => state.sm);
  const {
    cannotReply,
    drafts,
    messages,
    printOption,
    threadFolderId,
    threadViewCount,
  } = useSelector(state => state.sm.threadDetails);
  const { folder } = useSelector(state => state.sm.folders);

  const message = messages?.length && messages[0];
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
        dispatch(retrieveMessageThread(threadId))
          .then(() => {
            setIsLoaded(true);
          })
          .catch(() => {
            navigateToFolderByFolderId(folder?.folderId || 0, history);
          });
      }
      return () => {
        dispatch(closeAlert());
      };
    },
    [dispatch, threadId, location.pathname],
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
        <div className="compose-container">
          <ReplyForm
            cannotReply={cannotReply}
            drafts={drafts}
            header={header}
            messages={messages}
            recipients={recipients}
            replyMessage={messages[0]}
          />
          <MessageThread
            isDraftThread
            isForPrint={printOption === PrintMessageOptions.PRINT_THREAD}
            messageHistory={messages}
            viewCount={threadViewCount}
          />
        </div>
      );
    }
    if (drafts?.length === 1 && !messages?.length) {
      updatePageTitle(PageTitles.EDIT_DRAFT_PAGE_TITLE_TAG);
      return (
        <div className="compose-container">
          <h1 className="page-title vads-u-margin-top--0" ref={header}>
            Edit draft
          </h1>

          <ComposeForm draft={drafts[0]} recipients={recipients} />
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
            recipients={recipients}
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
