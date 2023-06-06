import React, { useState, useEffect, useRef, useMemo } from 'react';
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
    attachment,
    attachments,
    hasAttachments,
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
  const from = fromMe ? 'Me' : `${senderName}`;

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

  const accordionAriaLabel = useMemo(
    () => {
      return `${!isRead ? 'New' : ''} message ${
        attachment ? 'with attachment' : ''
      } from ${senderName}, ${dateFormat(
        sentDate,
        'MMMM D, YYYY [at] h:mm a z',
      )}. ${isExpanded ? 'Collapse message' : 'Expand message'}`;
    },
    [attachment, isExpanded, isRead, senderName, sentDate],
  );

  return (
    <VaAccordionItem
      aria-label={accordionAriaLabel}
      className={`older-message ${
        !isRead ? 'accordion-unread' : 'accordion-read'
      }`}
      ref={accordionItemRef}
      subheader={from}
      onAccordionItemToggled={() => {
        handleExpand(preloaded);
      }}
      data-testid={`expand-message-button-${messageId}`}
    >
      <h3 slot="headline">{dateFormat(sentDate, 'MMMM D [at] h:mm a z')}</h3>
      {!isRead && (
        <i
          data-testid="unread-icon"
          className="vads-u-color--primary vads-u-padding--0p25 vads-u-margin-right--1 fas fa-solid fa-circle fa-xs"
          slot="icon"
          aria-hidden
        />
      )}
      {(hasAttachments || attachment) && (
        <i
          data-testid="attachment-icon"
          className="vads-u-margin-right--1p5 fas fa-paperclip vads-u-color--base"
          slot="subheader-icon"
          aria-hidden
        />
      )}

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
