import React from 'react';

const UnAuthSendMessageSection = () => {
  return (
    <>
      <h2>To send messages, you must be a VA patient</h2>
      <p>
        And your VA provider must agree to communicate with you through secure
        messaging.
      </p>
      <p>
        VA health care covers primary care and specialist appointments, as well
        as services like home health and geriatric (elder) care. And VA offers
        family and caregiver health benefits.
      </p>
      <p className="vads-u-margin-top--3px">
        {/* TODO: add GA event, fix url target */}
        <a
          className="vads-c-action-link--blue apply-for-health-care-link"
          href="/my-health/secure-messages"
        >
          Apply for health care
        </a>
      </p>
      <p>
        {/* TODO: add GA event, fix url target */}
        <a href="/my-health/secure-messages">Learn about VA health benefits</a>
      </p>
    </>
  );
};

export default UnAuthSendMessageSection;
