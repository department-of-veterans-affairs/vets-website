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
  const { message } = props;
  const {
    // attachment,
    attachments,
    body,
    messageId,
    preloaded,
    // readReceipt,
    recipientName,
    senderName,
    sentDate,
    triageGroupName,
  } = message;

  // const isRead = readReceipt === 'READ';
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
      dispatch(markMessageAsReadInThread(messageId));
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
      header={dateFormat(sentDate, 'MMMM D, YYYY [at] h:mm a z')}
      subheader={from}
      // header={header()}
      // subheader={subheader()}
      onAccordionItemToggled={() => {
        handleExpand(preloaded);
      }}
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
    // <>
    //   <div className="older-message vads-u-padding-top--0p5 vads-u-padding-bottom--2 vads-u-display--flex vads-u-flex-direction--row">
    //     <div
    //       className="vads-u-flex--auto"
    //       role="img"
    //       aria-label={!isRead ? 'Unread message' : 'Previously read message'}
    //     >
    //       <i
    //         className="unread-icon fas fa-circle"
    //         aria-hidden
    //         style={{ visibility: isRead === true ? 'hidden' : '' }}
    //       />
    //     </div>

    //     <div
    //       className="vads-u-flex--fill "
    //       role="button"
    //       tabIndex={0}
    //       data-testid={`expand-message-button-${message.messageId}`}
    //       aria-expanded={isExpanded}
    //       aria-label={!isExpanded ? ariaLabel : ''}
    //       onClickCapture={e => {
    //         handleExpand(e);
    //       }}
    //       onKeyDown={e => {
    //         handleExpand(e);
    //       }}
    //     >
    // <MessageThreadMeta
    //         expanded={isExpanded}
    //         message={message}
    //         isRead={isRead}
    //         hasAttachments={hasAttachments}
    //       />
    //       <MessageThreadBody expanded={isExpanded} text={message.body} />
    // {isExpanded &&
    //   message.attachments?.length > 0 && (
    //     <MessageThreadAttachments
    //       expanded={isExpanded}
    //       // TODO check how backend can return attachments list
    //       attachments={message.attachments}
    //     />
    //   )}
    //     </div>
    //   </div>
    //   <HorizontalRule />
    // </>
  );
};

MessageThreadItem.propTypes = {
  message: PropTypes.object,
  printView: PropTypes.bool,
};

export default MessageThreadItem;
