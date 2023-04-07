import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui/index';
import PropTypes from 'prop-types';
import MessageThread from '../components/MessageThread/MessageThread';
import { retrieveMessageThread } from '../actions/messages';
import MessageDetailBlock from '../components/MessageDetailBlock';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import AlertBox from '../components/shared/AlertBox';
import ReplyForm from '../components/ComposeForm/ReplyForm';
import EmergencyNote from '../components/EmergencyNote';
import ComposeForm from '../components/ComposeForm/ComposeForm';
import { getTriageTeams } from '../actions/triageTeams';
import { clearDraft } from '../actions/draftDetails';
import InterstitialPage from './InterstitialPage';

const ThreadDetails = props => {
  const { threadId } = useParams();
  const { testing } = props;
  const dispatch = useDispatch();
  const alert = useSelector(state => state.sm.alerts.alert);
  const { triageTeams } = useSelector(state => state.sm.triageTeams);
  const { message, messageHistory } = useSelector(
    state => state.sm.messageDetails,
  );
  const { draftMessage, draftMessageHistory } = useSelector(
    state => state.sm.draftDetails,
  );

  const [cannotReplyAlert, setcannotReplyAlert] = useState(false);
  const [isMessage, setIsMessage] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [isLoaded, setIsLoaded] = useState(testing);
  const [acknowledged, setAcknowledged] = useState(false);
  const header = useRef();

  useEffect(
    () => {
      if (threadId) {
        dispatch(getTriageTeams());
        dispatch(retrieveMessageThread(threadId)).then(() => {
          setIsLoaded(true);
        });
      }
      return () => {
        return () => {
          dispatch(clearDraft());
        };
      };
    },
    [dispatch, threadId],
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
      if (alert?.header !== (null || undefined)) {
        setcannotReplyAlert(true);
      }
    },
    [cannotReplyAlert, alert?.header],
  );

  useEffect(
    () => {
      focusElement(header.current);
    },
    [header],
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
    if (isReply) {
      return (
        <div className="compose-container">
          <ReplyForm
            draftToEdit={draftMessage}
            replyMessage={draftMessageHistory[0]}
            cannotReplyAlert={cannotReplyAlert}
          />
          <MessageThread messageHistory={draftMessageHistory.slice(1)} />
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
          <MessageDetailBlock message={message} />
          {messageHistory?.length > 0 && (
            <MessageThread
              messageHistory={messageHistory}
              threadId={threadId}
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
      {/* Only display this type of alert when it contains a header */}
      {cannotReplyAlert ? <AlertBox /> : <AlertBackgroundBox closeable />}

      {content()}
    </div>
  );
};

ThreadDetails.propTypes = {
  testing: PropTypes.bool,
};

export default ThreadDetails;
