import React from 'react';

export const Notifications = ({ notifications }) => (
  <div className="vads-u-background-color--white vads-u-padding--2p5 rounded-corners">
    <a
      className="view-all-link vads-u-margin-bottom--neg4
     "
      href="/poaRequests"
    >
      View All
    </a>
    <va-table sort-column={1} table-title="POA Requests">
      <va-table-row slot="headers">
        <span>Claimant</span>
        <span>Submitted</span>
        <span>Accept/ decline</span>
      </va-table-row>
      {notifications.map(notification => {
        return (
          <va-table-row key={notification.id}>
            <span>
              <a href={`/representatives/request-details/${notification.id}`}>
                {notification.name}
              </a>
            </span>
            <span>{notification.date}</span>
            <span>
              <va-icon
                icon="alarm"
                size={4}
                srtext="add some text for a screen reader to describe the icon's semantic meaning"
              />
            </span>
          </va-table-row>
        );
      })}
    </va-table>
  </div>
);
