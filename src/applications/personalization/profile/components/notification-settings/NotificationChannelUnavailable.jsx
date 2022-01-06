import React from 'react';

import AddContactInfoLink from './AddContactInfoLink';

import { MISSING_CONTACT_INFO } from '@@vap-svc/constants';

const NotificationChannelUnavailable = ({ channelType }) => {
  const missingInfo = React.useMemo(
    () => {
      const map = {
        1: MISSING_CONTACT_INFO.MOBILE,
        2: MISSING_CONTACT_INFO.EMAIL,
      };
      return map[channelType];
    },
    [channelType],
  );

  const notificationType = React.useMemo(
    () => {
      const map = {
        1: 'text message',
        2: 'email',
      };
      return map[channelType];
    },
    [channelType],
  );

  return (
    <div>
      Want to get these notifications by {notificationType}?{' '}
      {<AddContactInfoLink missingInfo={missingInfo} />}
    </div>
  );
};

export default NotificationChannelUnavailable;
