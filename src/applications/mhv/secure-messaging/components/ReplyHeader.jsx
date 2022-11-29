import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import React, { useEffect, useRef } from 'react';
import EmergencyNote from './EmergencyNote';

const ReplyHeader = () => {
  const header = useRef();
  useEffect(
    () => {
      focusElement(header.current);
    },
    [header],
  );

  return (
    <header>
      <h1 ref={header}>Reply</h1>
      <EmergencyNote />
    </header>
  );
};

export default ReplyHeader;
