import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import { clearDraft } from '../actions/draftDetails';
import { retrieveMessageThread } from '../actions/messages';
import { getTriageTeams } from '../actions/triageTeams';
import BeforeMessageAddlInfo from '../components/BeforeMessageAddlInfo';
import ComposeForm from '../components/ComposeForm/ComposeForm';
import ReplyForm from '../components/ComposeForm/ReplyForm';
import MessageThread from '../components/MessageThread/MessageThread';
import EmergencyNote from '../components/EmergencyNote';
import AlertBox from '../components/shared/AlertBox';
import InterstitialPage from './InterstitialPage';
import { addAlert, closeAlert } from '../actions/alerts';
import { isOlderThan } from '../util/helpers';
import * as Constants from '../util/constants';

const Compose = () => {
  const dispatch = useDispatch();
  const { draftMessage, error } = useSelector(state => state.sm.draftDetails);
  const { triageTeams } = useSelector(state => state.sm.triageTeams);
  const { draftId } = useParams();
  const messageHistory = useSelector(
    state => state.sm.draftDetails.draftMessageHistory,
  );
  const [replyMessage, setReplyMessage] = useState(undefined);
  const [acknowledged, setAcknowledged] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const isDraftPage = location.pathname.includes('/draft');
  const header = useRef();

  useEffect(
    () => {
      // to prevent users from accessing draft edit view if directly hitting url path with messageId
      // in case that message no longer is a draft
      if (isDraftPage && draftMessage === undefined) {
        dispatch(retrieveMessageThread(draftId));
      }
      if (location.pathname === '/compose') {
        dispatch(clearDraft());
        setReplyMessage(null);
      }

      dispatch(getTriageTeams());
      return () => {
        dispatch(clearDraft());
      };
    },
    [dispatch, location.pathname],
  );

  useEffect(
    () => {
      if (draftMessage?.messageId && draftMessage.draftDate === null) {
        history.push('/inbox');
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
      // wait until messageHistory is retrieved to determine if we should show a ReplyForm
      // To prevent from Edit Draft Title falshing on screen
      if (messageHistory !== undefined) {
        if (messageHistory?.length > 0) {
          // TODO filter history to grab only received messages.
          setReplyMessage(messageHistory[0]);
        } else {
          setReplyMessage(null);
        }
      }
    },
    [messageHistory],
  );

  useEffect(
    () => {
      if (replyMessage && isOlderThan(replyMessage.sentDate, 45)) {
        dispatch(
          addAlert(
            Constants.ALERT_TYPE_INFO,
            Constants.Alerts.Message.DRAFT_CANNOT_REPLY_INFO_HEADER,
            Constants.Alerts.Message.DRAFT_CANNOT_REPLY_INFO_BODY,
            Constants.Links.Link.CANNOT_REPLY.CLASSNAME,
            Constants.Links.Link.CANNOT_REPLY.TO,
            Constants.Links.Link.CANNOT_REPLY.TITLE,
          ),
        );
      }
    },
    [replyMessage],
  );

  let pageTitle;

  if (isDraftPage) {
    pageTitle = 'Edit draft';
  } else {
    pageTitle = 'Compose message';
  }

  const content = () => {
    if (!isDraftPage && triageTeams) {
      return (
        <>
          <h1 className="page-title" ref={header}>
            {pageTitle}
          </h1>
          <EmergencyNote dropDownFlag />
          <ComposeForm draft={draftMessage} recipients={triageTeams} />
        </>
      );
    }
    if ((isDraftPage && !draftMessage) || (!isDraftPage && !triageTeams)) {
      return (
        <va-loading-indicator
          message="Loading your secure message..."
          setFocus
          data-testid="loading-indicator"
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

    if (replyMessage !== undefined) {
      return (
        <>
          {replyMessage === null ? (
            <>
              <h1 className="page-title" ref={header}>
                {pageTitle}
              </h1>
              <EmergencyNote />
              <div>
                <BeforeMessageAddlInfo />
              </div>
              <ComposeForm draft={draftMessage} recipients={triageTeams} />
            </>
          ) : (
            <>
              <ReplyForm
                draftToEdit={draftMessage}
                replyMessage={replyMessage}
                cannotReplyAlert={isOlderThan(replyMessage.sentDate, 45)}
              />
              {replyMessage &&
                messageHistory?.length > 1 && (
                  <MessageThread messageHistory={messageHistory.slice(1)} />
                )}
            </>
          )}
        </>
      );
    }
    return null;
  };

  return (
    <>
      {!acknowledged ? (
        <InterstitialPage
          acknowledge={() => {
            setAcknowledged(true);
          }}
        />
      ) : (
        <div className="vads-l-grid-container compose-container">
          <AlertBox />

          {content()}
        </div>
      )}
    </>
  );
};

export default Compose;
