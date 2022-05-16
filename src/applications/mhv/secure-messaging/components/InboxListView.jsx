import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAllMessages } from '../actions';

import InboxListItem from './InboxListItem';

const InboxListView = props => {
  const {
    allMessages: { isLoading, messages },
  } = props;

  useEffect(() => {
    props.getAllMessages();
  }, []);

  let content;
  if (isLoading) {
    content = (
      <va-loading-indicator
        message="Loading your secure messages..."
        setFocus
      />
    );
  }

  if (messages) {
    content = (
      <>
        <div className="vads-u-padding-y--1p5 vads-l-row vads-u-margin-top--2 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light">
          Displaying 1 - 20 of 33 most recent messages
        </div>
        {messages.data.map(message => (
          <InboxListItem
            key={message.id}
            attributes={message.attributes}
            link={message.link}
          />
        ))}
      </>
    );
  }
  return (
    <div className="vads-l-row vads-u-flex-direction--column vads-u-margin-top--2">
      {content}
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.user,
  allMessages: state.allMessages,
});

const mapDispatchToProps = {
  getAllMessages,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InboxListView);

InboxListView.propTypes = {
  allMessages: PropTypes.object,
  getAllMessages: PropTypes.func,
  user: PropTypes.object,
};
