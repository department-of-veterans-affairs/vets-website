import React from 'react';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const OlderMessages = () => (
  <div className="vads-l-row">
    <VaAdditionalInfo
      trigger="Older messages in this conversation"
      disable-border
    >
      Test
    </VaAdditionalInfo>
  </div>
);

export default OlderMessages;
