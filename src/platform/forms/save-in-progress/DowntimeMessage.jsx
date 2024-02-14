import React from 'react';
import classNames from 'classnames';
import { APP_TYPE_DEFAULT } from '../../forms-system/src/js/constants';

export default function DowntimeMessage({
  downtime,
  isAfterSteps,
  formConfig,
}) {
  const { endTime } = downtime;
  const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;
  return (
    <va-alert
      class={classNames({
        'schemaform-downtime-after-steps': isAfterSteps,
      })}
      isVisible
      status="warning"
      uswds
    >
      <h3 slot="headline">{`This ${appType} is down for maintenance.`}</h3>
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
    </va-alert>
  );
}
