import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import classNames from 'classnames';

export default function DowntimeMessage({ isAfterSteps }) {
  return (
    <AlertBox
      className={classNames({
        'schemaform-downtime-after-steps': isAfterSteps,
      })}
      headline="The health care application is down for maintenance."
      isVisible
      status="warning"
    >
      <div>
        <p>
          We’re sorry. The health care application is currently down while we
          fix a few things. We’ll be back up as soon as we can.
        </p>
        <p>
          In the meantime, you can call 1-877-222-VETS (
          <a href="tel:+18772228387">1-877-222-8387</a>
          ), Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (
          <abbr title="eastern time">ET</abbr>) and press 2 to complete this
          application over the phone.
        </p>
      </div>
    </AlertBox>
  );
}
