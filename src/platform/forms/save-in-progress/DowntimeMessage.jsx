import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { APP_TYPE_DEFAULT } from '../../forms-system/src/js/constants';

export default function DowntimeMessage({
  downtime,
  isAfterSteps,
  formConfig,
  headerLevel = 3,
}) {
  const { endTime } = downtime;
  const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;
  const Header = `h${headerLevel}`;
  return (
    <va-alert
      class={classNames({
        'schemaform-downtime-after-steps': isAfterSteps,
      })}
      isVisible
      status="warning"
      uswds
    >
      <Header slot="headline">
        {`This ${appType} is down for maintenance.`}
      </Header>
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

DowntimeMessage.propTypes = {
  downtime: PropTypes.shape({
    endTime: PropTypes.object, // Moment.js object
  }),
  formConfig: PropTypes.shape({
    customText: PropTypes.shape({
      appType: PropTypes.string,
    }),
  }),
  headerLevel: PropTypes.number,
  isAfterSteps: PropTypes.bool,
};
