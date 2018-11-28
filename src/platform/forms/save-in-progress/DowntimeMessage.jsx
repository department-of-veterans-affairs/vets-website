import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import classNames from 'classnames';

export default function DowntimeMessage({ downtime, isAfterSteps }) {
  const endTime = downtime.endTime;

  return (
    <AlertBox
      className={classNames({
        'schemaform-downtime-after-steps': isAfterSteps,
      })}
      headline="This form is down for maintenance."
      isVisible
      status="warning"
    >
      {endTime ? (
        <p>
          We’re making some updates to this form. We’re sorry it’s not working
          right now, and we hope to be finished by{' '}
          {endTime.format('MMMM Do, LT')} Please check back soon.
        </p>
      ) : (
        <p>
          We’re making some updates to this form. We’re sorry it’s not working
          right now. Please check back soon.
        </p>
      )}
    </AlertBox>
  );
}
