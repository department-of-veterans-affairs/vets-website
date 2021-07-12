import React from 'react';
import { connect } from 'react-redux';

import { isVAPatient } from '~/platform/user/selectors';

import { showNotificationSettings } from '@@profile/selectors';

const ReceiveAppointmentReminders = ({ hideContent, isReceivingReminders }) => {
  if (hideContent) {
    return null;
  }
  let content = null;

  if (isReceivingReminders) {
    content =
      'We text VA health appointment reminders to this number. To stop getting these reminders, edit your mobile number settings.';
  } else {
    content =
      'If you’d like to get text reminders for your VA health appointments, edit your mobile number settings.';
  }

  return <p className="vads-u-margin-bottom--0">{content}</p>;
};

export function mapStateToProps(state) {
  return {
    hideContent: !isVAPatient(state) || showNotificationSettings(state),
  };
}

export default connect(mapStateToProps)(ReceiveAppointmentReminders);

export { ReceiveAppointmentReminders };
