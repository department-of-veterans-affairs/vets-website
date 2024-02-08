import React from 'react';

export const Notifications = ({ notifications }) => (
  <div className="vads-u-background-color--white vads-u-padding--2p5 rounded-corners">
    <va-table table-title="Notifications">
      <va-table-row slot="headers">
        <span>Veteran</span>
        <span>Submitted</span>
        <span>Accept/ deny</span>
        <span>Details</span>
      </va-table-row>
      {notifications.map(notification => {
        return (
          <va-table-row key={notification.id}>
            <span>{notification.name}</span>
            <span>{notification.date}</span>
            <span>
              <va-icon
                icon="alarm"
                size={4}
                srtext="add some text for a screen reader to describe the icon's semantic meaning"
              />
            </span>
            <span>
              <a href={`/representatives/request-details/${notification.id}`}>
                Details
              </a>
            </span>
          </va-table-row>
        );
      })}
    </va-table>
  </div>
);
