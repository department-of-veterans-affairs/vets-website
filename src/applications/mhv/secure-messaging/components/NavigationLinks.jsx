import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMessages } from '../actions';

const NavigationLinks = props => {
  const history = useHistory();
  const dispatch = useDispatch();
  const messages = useSelector(state => state.sm.messages?.messageList);
  const currentMessage = useSelector(state => state.sm.messageDetails.message);
  const [nextMessageId, setNextMessageId] = useState(undefined);
  const [prevMessageId, setPrevMessageId] = useState(undefined);
  const messagesIdArr = useRef({});
  const index = useRef();

  useEffect(() => dispatch(getAllMessages()), [dispatch]);
  useEffect(
    () => {
      if (messages?.length > 0 && currentMessage) {
        messagesIdArr.current = messages.map(mes => {
          return mes.messageId;
        });

        index.current = messagesIdArr.current.findIndex(item => {
          return item === parseInt(currentMessage.messageId, 10);
        });
        setNextMessageId(messagesIdArr.current[index.current + 1]);
        setPrevMessageId(messagesIdArr.current[index.current - 1]);
      }
    },
    [messages, currentMessage, props.messageId],
  );

  const handlePrevious = e => {
    e.preventDefault();
    history.push(`/message/${prevMessageId}`);
  };
  const handleNext = e => {
    e.preventDefault();
    history.push(`/message/${nextMessageId}`);
  };

  return (
    <div className="vads-u-text-align--right nav-links">
      {prevMessageId !== undefined && (
        <a
          className="nav-links-text"
          aria-label="Navigate to previous message"
          href="/message"
          onClick={handlePrevious}
        >
          <i className="fas fa-angle-left" aria-hidden="true" /> Previous
        </a>
      )}

      {nextMessageId !== undefined && (
        <a
          className="nav-links-text"
          aria-label="Navigate to next message"
          href="/message"
          onClick={handleNext}
        >
          Next <i className="fas fa-angle-right" aria-hidden="true" />
        </a>
      )}
    </div>
  );
};

NavigationLinks.propTypes = {
  data: PropTypes.object,
  messageId: PropTypes.string,
};

export default NavigationLinks;
