import React, { useEffect } from 'react';

import { focusElement } from 'platform/utilities/ui';

const PersonalInformation = () => {
  useEffect(() => {
    focusElement('h2.profile-section-title');
  }, []);

  return (
    <h2
      tabIndex="-1"
      className="vads-u-margin-y--2 medium-screen:vads-u-margin-y--4 profile-section-title"
    >
      Personal Information
    </h2>
  );
};

export default PersonalInformation;
