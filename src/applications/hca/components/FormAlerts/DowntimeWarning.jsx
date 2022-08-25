import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const DowntimeWarning = ({ isAfterSteps }) => (
  <va-alert
    class={classNames({
      'schemaform-downtime-after-steps': isAfterSteps,
    })}
    status="warning"
  >
    <h2 slot="headline">
      The health care application is down for maintenance.
    </h2>
    <p>
      We’re sorry. The health care application is currently down while we fix a
      few things. We’ll be back up as soon as we can.
    </p>
    <p>
      In the meantime, you can call{' '}
      <va-telephone contact={CONTACTS['222_VETS']} />, Monday through Friday,
      8:00 a.m. to 8:00 p.m. (<abbr title="eastern time">ET</abbr>) and press 2
      to complete this application over the phone.
    </p>
  </va-alert>
);

DowntimeWarning.propTypes = {
  isAfterSteps: PropTypes.bool,
};

export default DowntimeWarning;
