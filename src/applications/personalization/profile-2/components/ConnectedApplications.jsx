import React, { useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui';

const ConnectedApplications = () => {
  useEffect(() => {
    focusElement('[data-focus-target]');
  }, []);

  return (
    <h2
      tabIndex="-1"
      className="vads-u-line-height--1  vads-u-margin-y--2 medium-screen:vads-u-margin-y--4"
      data-focus-target
    >
      Connected Applications
    </h2>
  );
};

export default ConnectedApplications;
