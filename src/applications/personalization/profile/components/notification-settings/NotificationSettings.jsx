import React, { useEffect } from 'react';

import Headline from '../ProfileSectionHeadline';
import { PROFILE_PATH_NAMES } from '../../constants';

const NotificationSettings = () => {
  useEffect(() => {
    document.title = `Notification Settings | Veterans Affairs`;
  }, []);

  return (
    <>
      <Headline>{PROFILE_PATH_NAMES.NOTIFICATION_SETTINGS}</Headline>
    </>
  );
};

NotificationSettings.propTypes = {};

export default NotificationSettings;
