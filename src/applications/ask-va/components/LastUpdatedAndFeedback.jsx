import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';

const LastUpdatedAndFeedback = () => {
  return (
    <div className="vads-u-display--flex vads-u-border-top--1px vads-u-align-center vads-u-justify-content--space-between vads-u-margin-bottom--3">
      <p className="vads-u-margin-top--1">Last updated: Month DD, YYYY</p>
      <VaButton primary text="Feedback" className="vads-u-margin-right--0" />
    </div>
  );
};

export default LastUpdatedAndFeedback;
