import React, { useRef, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { VaAccordionItem } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import HorizontalRule from '../shared/HorizontalRule';
import MessageThreadMeta from './MessageThreadMeta';
import MessageThreadBody from './MessageThreadBody';
import MessageThreadAttachments from './MessageThreadAttachments';
import { markMessageAsReadInThread } from '../../actions/messages';
import { dateFormat } from '../../util/helpers';
import { DefaultFolders, MessageReadStatus } from '../../util/constants';

const MessageThreadItem = props => {
  const dispatch = useDispatch();
  const accordionItemRef = useRef();
  const { message, isDraftThread, open, forPrint } = props;
  const {
    attachment,
    attachments,
    hasAttachments,
    body,
    folderId,
    messageId,
    preloaded,
    readReceipt,
    recipientName,
    senderName,
    sentDate,
    triageGroupName,
  } = message;
  const isDraft = folderId === DefaultFolders.DRAFTS.id;

  const isSentOrReadOrDraft =
    folderId === DefaultFolders.SENT.id ||
    isDraft ||
    readReceipt === MessageReadStatus.READ;

  const fromMe = recipientName === triageGroupName;
  const from = fromMe ? 'Me' : `${senderName}`;

  const handleExpand = () => {
    // isSentOrReandOrDraft is most reliable prop to determine if message is read or unread
    if (!forPrint && !isSentOrReadOrDraft) {
      dispatch(markMessageAsReadInThread(messageId, isDraftThread));
    }
  };

  useEffect(
    () => {
      if (open && !preloaded) {
        // opening an accordion by triggering an event, as passing in the open prop makes the accordion uncontrolled and rerender
        const accordionItemToggledEvent = new CustomEvent(
          'accordionItemToggled',
          {
            bubbles: true,
            detail: {},
          },
        );
        accordionItemRef.current.dispatchEvent(accordionItemToggledEvent);
      }
    },
    [dispatch, isDraftThread, messageId, open, preloaded],
  );

  const accordionAriaLabel = useMemo(
    () => {
      return `${!isSentOrReadOrDraft ? 'New ' : ''}message ${
        fromMe ? 'sent' : 'received'
      } ${dateFormat(sentDate, 'MMMM D, YYYY [at] h:mm a z')}, ${
        hasAttachments || attachment ? 'with attachment' : ''
      } from ${senderName}.`;
    },
    [
      attachment,
      fromMe,
      hasAttachments,
      isSentOrReadOrDraft,
      senderName,
      sentDate,
    ],
  );

  return (
    <VaAccordionItem
      data-dd-privacy="mask" // need to mask entire accordion as the subheader with the sender name cannot masked
      aria-label={accordionAriaLabel}
      className={`older-message ${
        !isSentOrReadOrDraft ? 'accordion-unread' : 'accordion-read'
      }`}
      ref={accordionItemRef}
      subheader={!isDraft ? from : ''}
      onAccordionItemToggled={() => {
        handleExpand();
      }}
      data-testid={
        forPrint
          ? `expand-message-button-for-print-${messageId}`
          : `expand-message-button-${messageId}`
      }
    >
      <h3 slot="headline">
        {isDraft ? 'DRAFT' : dateFormat(sentDate, 'MMMM D [at] h:mm a z')}
      </h3>
      {!isSentOrReadOrDraft && (
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
        <MessageThreadMeta
          message={message}
          fromMe={fromMe}
          forPrint={forPrint}
        />
        <HorizontalRule />
        <MessageThreadBody
          text={body}
          forPrint={forPrint}
          messageId={messageId}
        />

        {attachments?.length > 0 && (
          <MessageThreadAttachments
            attachments={attachments}
            forPrint={forPrint}
          />
        )}
      </div>
    </VaAccordionItem>
  );
};

MessageThreadItem.propTypes = {
  forPrint: PropTypes.bool,
  isDraftThread: PropTypes.bool,
  message: PropTypes.object,
  open: PropTypes.bool,
  printView: PropTypes.bool,
};

export default MessageThreadItem;
