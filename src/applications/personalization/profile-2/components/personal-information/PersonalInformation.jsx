import React, { useEffect } from 'react';

import { focusElement } from 'platform/utilities/ui';

import PersonalInformationContent from './PersonalInformationContent';

const PersonalInformation = () => {
  useEffect(() => {
    focusElement('[data-focus-target]');
  }, []);

  return (
    <>
      <h2
        tabIndex="-1"
        className="vads-u-margin-y--2 medium-screen:vads-u-margin-bottom--4 medium-screen:vads-u-margin-top--3"
        data-focus-target
      >
        Personal and contact information
      </h2>
      <PersonalInformationContent />
    </>
  );
};

export default PersonalInformation;
