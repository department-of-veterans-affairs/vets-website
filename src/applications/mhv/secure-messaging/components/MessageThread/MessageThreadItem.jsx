import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { VaAccordionItem } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import HorizontalRule from '../shared/HorizontalRule';
import MessageThreadMeta from './MessageThreadMeta';
import MessageThreadBody from './MessageThreadBody';
import MessageThreadAttachments from './MessageThreadAttachments';
import { markMessageAsReadInThread } from '../../actions/messages';
import { dateFormat } from '../../util/helpers';

const MessageThreadItem = props => {
  const dispatch = useDispatch();
  const accordionItemRef = useRef();
  const [isExpanded, setIsExpanded] = useState(false);
  const { message, isDraftThread } = props;
  const {
    // attachment,
    attachments,
    body,
    messageId,
    preloaded,
    readReceipt,
    recipientName,
    senderName,
    sentDate,
    triageGroupName,
  } = message;

  const isRead = readReceipt === 'READ';
  const fromMe = recipientName === triageGroupName;
  const from = fromMe ? 'Me' : `${senderName} ${triageGroupName}`;

  useEffect(
    () => {
      if (props.printView) {
        setIsExpanded(true);
      }
    },
    [props.printView],
  );

  const handleExpand = isPreloaded => {
    if (!isPreloaded) {
      dispatch(markMessageAsReadInThread(messageId, isDraftThread));
    }
    setIsExpanded(!isExpanded);
  };

  // const header = () => {
  //   return (
  //     <>
  //       <i
  //         className="unread-icon fas fa-circle"
  //         aria-hidden
  //         style={{ visibility: isRead === true ? 'hidden' : '' }}
  //       />
  //       {dateFormat(sentDate, 'MMMM D, YYYY [at] h:mm a z')}
  //     </>
  //   );
  // };

  // const subheader = () => {
  //   return (
  //     <>
  //       <i
  //         className="fas fa-paperclip"
  //         aria-hidden
  //         style={{ visibility: attachments !== true ? 'hidden' : '' }}
  //       />
  //       {from}
  //     </>
  //   );
  // };

  // const ariaLabel = useMemo(
  //   () => {
  //     return `${!isRead ? 'New' : ''} message ${
  //       attachment ? 'with attachment' : ''
  //     } from ${senderName}, ${dateFormat(
  //       sentDate,
  //       'MMMM D, YYYY [at] h:mm a z',
  //     )}. Click to ${isExpanded ? 'Collapse message' : 'Expand message'}`;
  //   },
  //   [attachment, isExpanded, isRead, senderName, sentDate],
  // );

  return (
    <VaAccordionItem
      className="older-message"
      ref={accordionItemRef}
      header={`${!isRead ? '[UNREAD] ' : ''}${dateFormat(
        sentDate,
        'MMMM D, YYYY [at] h:mm a z',
      )}`}
      subheader={from}
      // header={header()}
      // subheader={subheader()}
      onAccordionItemToggled={() => {
        handleExpand(preloaded);
      }}
      data-testid={`expand-message-button-${messageId}`}
    >
      <div>
        <MessageThreadMeta message={message} fromMe={fromMe} />
        <HorizontalRule />
        <MessageThreadBody text={body} />

        {attachments?.length > 0 && (
          <MessageThreadAttachments attachments={attachments} />
        )}
      </div>
    </VaAccordionItem>
  );
};

MessageThreadItem.propTypes = {
  isDraftThread: PropTypes.bool,
  message: PropTypes.object,
  printView: PropTypes.bool,
};

export default MessageThreadItem;
