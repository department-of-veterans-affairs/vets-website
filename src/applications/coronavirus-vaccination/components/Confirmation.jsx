import React from 'react';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function Confirmation() {
  return (
    <AlertBox
      status={ALERT_TYPE.SUCCESS}
      headline="Your application has been received"
      content="Thank you"
    />
  );
}
