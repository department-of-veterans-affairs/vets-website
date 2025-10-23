import React from 'react';

export default function DowntimeNotificationWrapper({
  status,
  children,
  className,
}) {
  const classes = `downtime-notification ${className}`;
  return (
    <div className={classes} data-status={status}>
      {children}
    </div>
  );
}
