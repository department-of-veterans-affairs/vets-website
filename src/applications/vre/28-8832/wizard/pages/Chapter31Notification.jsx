import React from 'react';

import { VRE_ROOT_URL } from '../../constants';

const Chapter31Notification = () => (
  <div className="vads-u-margin-top--2 vads-u-padding--3 vads-u-background-color--primary-alt-lightest">
    <p className="vads-u-margin--0">
      You may be eligible for Chapter 31 Veteran Readiness and Employment
      benefits. To apply for Chapter 31 benefits,{' '}
      <a href={VRE_ROOT_URL}>please start your application</a>
    </p>
  </div>
);

export default {
  name: 'chapter31Notification',
  component: Chapter31Notification,
};
