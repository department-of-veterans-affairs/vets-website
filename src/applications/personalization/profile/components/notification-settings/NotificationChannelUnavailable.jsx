import React from 'react';

import AddContactInfoLink from './AddContactInfoLink';

const NotificationChannelUnavailable = ({ channelType }) => {
  const missingInfo = React.useMemo(
    () => {
      const map = {
        1: AddContactInfoLink.MOBILE,
        2: AddContactInfoLink.EMAIL,
      };
      return map[channelType];
    },
    [channelType],
  );
  const notificationType = React.useMemo(
    () => {
      let result;
      switch (channelType) {
        case 1:
          result = `SMS text notifications`;
          break;
        case 2:
          result = `email notifications`;
          break;
        default:
          break;
      }
      return result;
    },
    [channelType],
  );
  return (
    <div>
      To get {notificationType}, first{' '}
      {<AddContactInfoLink missingInfo={missingInfo} />}.
    </div>
  );
};

export default NotificationChannelUnavailable;
