import React, { useRef, useMemo } from 'react';
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

  const handleExpand = isPreloaded => {
    if (!isPreloaded) {
      dispatch(markMessageAsReadInThread(messageId, isDraftThread));
    }
  };

  const accordionAriaLabel = useMemo(
    () => {
      return `${!isRead ? 'New ' : ''}message ${
        fromMe ? 'sent' : 'received'
      } ${dateFormat(sentDate, 'MMMM D, YYYY [at] h:mm a z')}, ${
        hasAttachments ? 'with attachment' : ''
      } from ${senderName}."`;
    },
    [fromMe, hasAttachments, isRead, senderName, sentDate],
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
          role="img"
          aria-hidden
          data-testid="unread-icon"
          className="vads-u-color--primary vads-u-padding--0p25 vads-u-margin-right--1 fas fa-solid fa-circle fa-xs"
          slot="icon"
          alt="Unread message icon"
        />
      )}
      {(hasAttachments || attachment) && (
        <i
          role="img"
          data-testid="attachment-icon"
          className="vads-u-margin-right--1p5 fas fa-paperclip vads-u-color--base"
          slot="subheader-icon"
          aria-hidden
          alt="Attachment icon"
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
