import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMessages } from '../actions';

const NavigationLinks = props => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { messages } = useSelector(state => state?.allMessages);
  const messagesIdArr = useRef({});
  const index = useRef();

  useEffect(() => dispatch(getAllMessages()), [dispatch]);
  useEffect(
    () => {
      if (messages) {
        messagesIdArr.current = messages.data.map(mes => {
          return mes.attributes.message_id;
        });

        index.current = messagesIdArr.current.findIndex(item => {
          return item === parseInt(props.id, 10);
        });
      }
    },
    [messages, props.id],
  );

  const handlePrevious = e => {
    e.preventDefault();
    history.push(`/message/${messagesIdArr.current[index.current - 1]}`);
  };
  const handleNext = e => {
    e.preventDefault();
    history.push(`/message/${messagesIdArr.current[index.current + 1]}`);
  };

  return (
    <div className="vads-u-text-align--right nav-links">
      <a
        className="nav-links-text"
        aria-label="Navigate to previous message"
        href="/message"
        onClick={handlePrevious}
      >
        <i className="fas fa-angle-left" /> Previous
      </a>
      <a
        className="nav-links-text"
        aria-label="Navigate to next message"
        href="/message"
        onClick={handleNext}
      >
        Next <i className="fas fa-angle-right" />
      </a>
    </div>
  );
};

NavigationLinks.propTypes = {
  data: PropTypes.object,
  id: PropTypes.string,
};

export default NavigationLinks;
