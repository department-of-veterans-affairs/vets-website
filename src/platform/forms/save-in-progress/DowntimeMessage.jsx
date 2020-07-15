import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import classNames from 'classnames';
import { APP_TYPE_DEFAULT } from '../constants';

export default function DowntimeMessage({
  downtime,
  isAfterSteps,
  formConfig,
}) {
  const endTime = downtime.endTime;
  const { appType } = formConfig?.customText?.appType || APP_TYPE_DEFAULT;
  return (
    <AlertBox
      className={classNames({
        'schemaform-downtime-after-steps': isAfterSteps,
      })}
      headline={`This ${appType} is down for maintenance.`}
      isVisible
      status="warning"
    >
      {endTime ? (
        <p>
          We’re making some updates to this {appType}. We’re sorry it’s not
          working right now, and we hope to be finished by{' '}
          {endTime.format('MMMM Do, LT')} Please check back soon.
        </p>
      ) : (
        <p>
          We’re making some updates to this {appType}. We’re sorry it’s not
          working right now. Please check back soon.
        </p>
      )}
    </AlertBox>
  );
}
