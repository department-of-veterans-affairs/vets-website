import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import NavigationLinks from '../components/NavigationLinks';
import OlderMessages from '../components/OlderMessages';
import { getMessage } from '../actions';
import MessageDetailBlock from '../components/MessageDetailBlock';

const MessageDetail = () => {
  const dispatch = useDispatch();
  const { isLoading, message, error } = useSelector(state => state.message);
  const isTrash = window.location.pathname.includes('/trash');
  const isSent = window.location.pathname.includes('/sent');
  const messageId = window.location.pathname.split('/').pop();

  useEffect(
    () => {
      const id = !!Number.isNaN(messageId) || 7155731;
      dispatch(getMessage('message', id));
    },
    [dispatch, messageId],
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

      <NavigationLinks />

      {content()}
    </div>
  );
};

export default MessageDetail;
