/* eslint-disable react/prop-types */
import React from 'react';
import classNames from 'classnames';

export default function DowntimeMessage({ isAfterSteps }) {
  return (
    <va-alert
      className={classNames({
        'schemaform-downtime-after-steps': isAfterSteps,
      })}
      visible
      status="warning"
    >
      <h3 slot="headline">
        The health care application is down for maintenance.
      </h3>
      <p>
        We’re sorry. The health care application is currently down while we fix
        a few things. We’ll be back up as soon as we can.
      </p>
      <p>
        In the meantime, you can call <va-telephone contact="8772228387" />,
        Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (
        <abbr title="eastern time">ET</abbr>) and press 2 to complete this
        application over the phone.
      </p>
    </va-alert>
  );
}
