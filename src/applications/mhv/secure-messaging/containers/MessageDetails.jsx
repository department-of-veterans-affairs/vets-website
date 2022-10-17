import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import NavigationLinks from '../components/NavigationLinks';
import MessageThread from '../components/MessageThread/MessageThread';
import { retrieveMessage } from '../actions/messages';
import MessageDetailBlock from '../components/MessageDetailBlock';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import { closeAlert } from '../actions/alerts';

const MessageDetail = () => {
  const { messageId } = useParams();
  const dispatch = useDispatch();
  const message = useSelector(state => state.sm.messageDetails.message);
  const isTrash = window.location.pathname.includes('/trash');
  const isSent = window.location.pathname.includes('/sent');
  const location = useLocation();
  const [id, setid] = useState(null);

  useEffect(
    () => {
      setid(messageId);
      if (id) {
        dispatch(closeAlert()); // to clear out any past alerts before landing this page
        dispatch(retrieveMessage(id));
      }
    },
    [dispatch, location, messageId, id],
  );

  let pageTitle;

  if (isSent) {
    pageTitle = 'Sent messages';
  } else if (isTrash) {
    pageTitle = 'Trash';
  } else {
    pageTitle = 'Message';
  }

  const content = () => {
    if (message === undefined) {
      return (
        <va-loading-indicator
          message="Loading your secure message..."
          setFocus
        />
      );
    }
    if (message === null || message === false) {
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
    return (
      <>
        <MessageDetailBlock message={message} />
        <MessageThread />
      </>
    );
  };

  return (
    <div className="vads-l-grid-container vads-u-margin-top--2 message-detail-container">
      <AlertBackgroundBox closeable />
      <h1 className="vads-u-margin-top--2">{pageTitle}</h1>

      <NavigationLinks messageId={id} />

      {content()}
    </div>
  );
};

export default MessageDetail;
