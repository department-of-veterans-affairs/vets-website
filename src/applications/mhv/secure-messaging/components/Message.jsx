import React from 'react';
import PropTypes from 'prop-types';

const Message = props => {
  return (
    <div>
      <div className="older-message vads-u-border-top--1px">
        <div className="vads-u-padding--2p5">
          <p>
            <strong>From: </strong>
            Dunwoody, Ann E.
          </p>
          <a href="http://localhost:3001/my-health/secure-messages/reply/">
            Test: Your lab results
          </a>
          <p>August 15, 2021 at 1:32 p.m. ET</p>
          {props.expanded && (
            <p className="message-list-body-expanded">
              This is a test Body of the message. This message body will appear
              in older messages info if expanded
            </p>
          )}
        </div>
      </div>
      <div className="older-message vads-u-border-top--1px">
        <div className="vads-u-padding--2p5">
          <p>
            <strong>From: </strong>
            Me
          </p>
          <a href="http://localhost:3001/my-health/secure-messages/reply/">
            Test: Your lab results
          </a>
          <p>May 15, 2021 at 11:32 a.m. ET</p>
          {props.expanded && (
            <p className="message-list-body-expanded">
              This is a test Body of the message. This message body will appear
              in older messages info if expanded
            </p>
          )}
        </div>
      </div>
      <div className="vads-u-border-top--1px" />
    </div>
  );
};

Message.propTypes = {
  expanded: PropTypes.bool,
};

export default Message;
