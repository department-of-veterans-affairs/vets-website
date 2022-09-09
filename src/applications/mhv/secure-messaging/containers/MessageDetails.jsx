import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import NavigationLinks from '../components/NavigationLinks';
import OlderMessages from '../components/OlderMessages';
import Breadcrumbs from '../components/shared/Breadcrumbs';
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
  let breadcrumbName;
  let breadcrumbLink;

  if (isSent) {
    breadcrumbName = 'Sent messages';
    breadcrumbLink = '/sent';
    pageTitle = 'Sent messages';
  } else if (isTrash) {
    breadcrumbName = 'Trash';
    breadcrumbLink = '/trash';
    pageTitle = 'Trash';
  } else {
    breadcrumbName = 'Message';
    breadcrumbLink = '/message';
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
      <nav>
        <Breadcrumbs pageName={breadcrumbName} link={breadcrumbLink} />
        <button
          type="button"
          className="vads-u-margin-top--2 usa-button-secondary section-guide-button medium-screen:vads-u-display--none"
        >
          <span>In the Messages section</span>
          <i className="fas fa-bars" aria-hidden="true" />
        </button>
      </nav>

      <h1 className="vads-u-margin-top--2">{pageTitle}</h1>

      <NavigationLinks id={id} />

      {content()}
    </div>
  );
};

export default MessageDetail;
