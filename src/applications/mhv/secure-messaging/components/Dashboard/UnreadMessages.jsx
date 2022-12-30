import React from 'react';

const UnreadMessages = () => {
  return (
    <div className="unread-messages">
      <h2>15 Unread Messages</h2>
      <p>You only have 45 days to respond before you can’t.</p>
      <va-button text="View Inbox" />
    </div>
  );
};

export default UnreadMessages;
