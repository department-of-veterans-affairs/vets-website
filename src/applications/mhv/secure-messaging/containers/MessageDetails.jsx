import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import NavigationLinks from '../components/NavigationLinks';
import OlderMessages from '../components/OlderMessages';
import { getMessage } from '../actions';
import MessageDetailBlock from '../components/MessageDetailBlock';

const MessageDetail = () => {
  const { messageId } = useParams();
  const dispatch = useDispatch();
  const { isLoading, message, error } = useSelector(state => state.message);
  const isTrash = window.location.pathname.includes('/trash');
  const isSent = window.location.pathname.includes('/sent');
  const location = useLocation();
  const [id, setid] = useState(null);

  useEffect(
    () => {
      setid(messageId);
      if (id) {
        dispatch(getMessage('message', id)); // 7155731 is the only message id that we have a mock api call for, all others will display an error message
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
    if (isLoading) {
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
    return (
      <>
        <MessageDetailBlock message={message} />
        <OlderMessages />
      </>
    );
  };

  return (
    <div className="vads-l-grid-container vads-u-margin-top--2 message-detail-container">
      <h1 className="vads-u-margin-top--2">{pageTitle}</h1>

      <NavigationLinks messageId={id} />

      {content()}
    </div>
  );
};

export default MessageDetail;
