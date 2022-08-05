import React from 'react';

const Message = () => (
  <div>
    <div className="vads-u-border-top--1px">
      <div>
        <p>
          <strong>From: </strong>
          Dunwoody, Ann E.
        </p>
        <a href="http://localhost:3001/my-health/secure-messages/reply/">
          Test: Your lab results
        </a>
        <p>August 15, 2021 at 1:32 p.m. ET</p>
      </div>
    </div>
    <div className="vads-u-border-top--1px">
      <div>
        <p>
          <strong>From: </strong>
          Me
        </p>
        <a href="http://localhost:3001/my-health/secure-messages/reply/">
          Test: Your lab results
        </a>
        <p>May 15, 2021 at 11:32 a.m. ET</p>
      </div>
    </div>
    <div className="vads-u-border-top--1px" />
  </div>
);

export default Message;
