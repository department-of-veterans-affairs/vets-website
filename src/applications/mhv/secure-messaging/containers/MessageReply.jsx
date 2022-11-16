import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReplyHeader from '../components/ReplyHeader';
import BeforeMessageAddlInfo from '../components/BeforeMessageAddlInfo';
import ReplyBox from '../components/ReplyBox';
import MessageThread from '../components/MessageThread/MessageThread';
import { retrieveMessageHistory } from '../actions/messages';

const MessageReply = () => {
  const dispatch = useDispatch();
  const messageId = useSelector(
    state => state.sm.messageDetails.message?.messageId,
  );
  const messageHistory = useSelector(
    state => state.sm.messageDetails.messageHistory,
  );
  const history = useHistory();

  useEffect(() => {
    if (!messageId) {
      history.push('/');
    } else {
      dispatch(retrieveMessageHistory(messageId));
    }
  });

  return (
    <div className="vads-l-grid-container reply-container">
      <div>
        <ReplyHeader />
        <BeforeMessageAddlInfo />
        <ReplyBox />
        <MessageThread messageHistory={messageHistory} />
      </div>
    </div>
  );
};

export default MessageReply;
