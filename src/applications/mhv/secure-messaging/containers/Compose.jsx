import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import { clearDraft } from '../actions/draftDetails';
import { retrieveMessage } from '../actions/messages';
import { getTriageTeams } from '../actions/triageTeams';
import BeforeMessageAddlInfo from '../components/BeforeMessageAddlInfo';
import ComposeForm from '../components/ComposeForm/ComposeForm';
import ReplyForm from '../components/ComposeForm/ReplyForm';
import MessageThread from '../components/MessageThread/MessageThread';
import EmergencyNote from '../components/EmergencyNote';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import { DefaultFolders } from '../util/constants';

const Compose = () => {
  const dispatch = useDispatch();
  const { draftMessage, error } = useSelector(state => state.sm.draftDetails);
  const { triageTeams } = useSelector(state => state.sm.triageTeams);
  const { draftId } = useParams();
  const activeFolder = useSelector(state => state.sm.folders.folder);
  const messageHistory = useSelector(
    state => state.sm.draftDetails.draftMessageHistory,
  );
  const [replyMessage, setReplyMessage] = useState(null);
  const location = useLocation();
  const history = useHistory();
  const isDraftPage = location.pathname.includes('/draft');

  useEffect(
    () => {
      // to prevent users from accessing draft edit view if directly hitting url path with messageId
      // in case that message no longer is a draft
      if (isDraftPage && activeFolder?.folderId !== DefaultFolders.DRAFTS.id) {
        history.push('/drafts');
      }
      if (location.pathname === '/compose') {
        dispatch(clearDraft());
      }
      dispatch(getTriageTeams());
      if (isDraftPage && draftId) {
        dispatch(retrieveMessage(draftId, true));
      }
    },
    [isDraftPage, draftId, activeFolder, dispatch, history],
  );

  useEffect(
    () => {
      if (messageHistory && messageHistory.length > 0) {
        // TODO filter history to grab only received messages.
        setReplyMessage(messageHistory[0]);
      }
    },
    [messageHistory],
  );

  let pageTitle;

  if (isDraftPage) {
    pageTitle = 'Edit draft';
  } else {
    pageTitle = 'Compose message';
  }

  const content = () => {
    if ((isDraftPage && !draftMessage) || !triageTeams) {
      return (
        <va-loading-indicator
          message="Loading your secure message..."
          setFocus
        />
      );
    }
    if (error) {
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
    if (messageHistory && messageHistory.length > 0) {
      return (
        <>
          <ReplyForm draft={draftMessage} replyMessage={replyMessage} />
          <MessageThread messageHistory={messageHistory} />
        </>
      );
    }
    return <ComposeForm draft={draftMessage} recipients={triageTeams} />;
  };

  return (
    <div className="vads-l-grid-container compose-container">
      <AlertBackgroundBox closeable />
      <h1 className="page-title">{pageTitle}</h1>
      <EmergencyNote />
      <div>
        <BeforeMessageAddlInfo />
      </div>

      {content()}
    </div>
  );
};

export default Compose;
