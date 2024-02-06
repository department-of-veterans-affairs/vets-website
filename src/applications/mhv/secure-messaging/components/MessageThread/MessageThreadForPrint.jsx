/*
Printable full message thread expanded
*/

import React from 'react';
import PropType from 'prop-types';
import { VaAccordion } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import MessageThreadItem from './MessageThreadItem';

const MessageThreadForPrint = props => {
  const { messageHistory } = props;

  return (
    <div visible data-testid="message-thread-for-print" className="print-only">
      <h2 className="messages-in-conversation vads-u-font-weight--bold vads-u-margin-bottom--0p5 vads-u-font-size--lg">
        {messageHistory?.length > 0 &&
          `${messageHistory?.length} Message${
            messageHistory?.length > 1 ? 's' : ''
          } in this conversation`}
      </h2>
      <VaAccordion bordered>
        {messageHistory?.map(m => {
          return (
            <>
              <MessageThreadItem key={m.messageId} message={m} open forPrint />
            </>
          );
        })}
      </VaAccordion>
    </div>
  );
};
MessageThreadForPrint.propTypes = {
  isDraftThread: PropType.bool,
  messageHistory: PropType.array,
  visible: PropType.bool,
};
export default MessageThreadForPrint;
