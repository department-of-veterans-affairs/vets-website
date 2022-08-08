import React from 'react';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Message from './Message';

const OlderMessages = () => (
  <div>
    <VaAdditionalInfo
      trigger="Older messages in this conversation"
      disable-border
    >
      <VaAdditionalInfo
        class="expand-messages"
        trigger="Expand All Messages"
        disable-border
      />

      <Message />
    </VaAdditionalInfo>
  </div>
);

export default OlderMessages;
