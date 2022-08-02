import React from 'react';
import { VaTextarea } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ReplyBox = () => (
  <div className="vads-l-row message-box vads-u-padding--0p25">
    <div className="vads-l-row">
      <h2 className="vads-l-col message-title">Test: Your lab results</h2>
      <div className="vads-l-col--2">
        <a
          href="http://localhost:3001/my-health/secure-messages/reply/"
          className="vads-u-text-align--right"
        >
          Send
        </a>
      </div>
    </div>
    <div className="vads-l-row message-body vads-u-padding--0p25">
      <div className="vads-l-row message-body">
        <p className="message-body">
          <strong>From: </strong>
          Lewis, Jennifer
        </p>
        <p className="message-body">
          <strong>To: </strong>
          Dunwoody, Ann E. (My HealtheVet Questions_PugetSound_ADMIN)
        </p>
        <p className="message-body">
          <strong>Date: </strong>
          August 16, 2021 at 1:32 p.m. ET
        </p>
        <p className="message-body">
          <strong>Message ID: </strong>
          8675309
        </p>
      </div>
      <VaTextarea
        label="Message"
        name="message-body"
        onBlur={function noRefCheck() {}}
        onInput={function noRefCheck() {}}
        placeholder=""
        required
      />
    </div>
  </div>
);

export default ReplyBox;
