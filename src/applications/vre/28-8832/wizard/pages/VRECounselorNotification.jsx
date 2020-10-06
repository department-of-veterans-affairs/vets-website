import React from 'react';
import { VRE_COUNSELOR_ROOT_URL } from '../../constants';

const VRECounselorNotification = () => (
  <div className="vads-u-margin-top--2 vads-u-background-color--primary-alt-lightest vads-u-padding--3">
    <p className="vads-u-margin-top--0">
      Please contact your vocational rehabilitation counselor to learn more
      about how to get career planning and guidance benefits.
    </p>
    <a href={VRE_COUNSELOR_ROOT_URL}>
      Contact a vocational rehabilitation counselor
    </a>
  </div>
);

export default {
  name: 'VRECounselorNotification',
  component: VRECounselorNotification,
};
