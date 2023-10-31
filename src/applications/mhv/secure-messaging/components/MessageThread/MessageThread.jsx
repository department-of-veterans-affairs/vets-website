/*
On each <MeesageThreadItem> expand we need to send a /read call to the backend to retrieve full message data.
We are able to do this by using the onAccordionItemToggled event from the <va-accordion> component.
However, as of 4/11/2023 <va-accordion> Expand All button is not triggering onAccordionItemToggled 
for each individual <va-accordion-item> event. Prelaoding all messages on the first render of <MessageThread>
is not an option since it will mark all messages as read. 
*/

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropType from 'prop-types';
import {
  VaAccordion,
  VaAccordionItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import HorizontalRule from '../shared/HorizontalRule';
import MessageThreadItem from './MessageThreadItem';
import MessageThreadMeta from './MessageThreadMeta';
import MessageThreadBody from './MessageThreadBody';
import MessageThreadAttachments from './MessageThreadAttachments';
import {
  clearMessageHistory,
  markMessageAsReadInThread,
} from '../../actions/messages';
import { Actions } from '../../util/actionTypes';
import { dateFormat } from '../../util/helpers';
import { DefaultFolders, MessageReadStatus } from '../../util/constants';
import useInterval from '../../hooks/use-interval';

const MessageThread = props => {
  const dispatch = useDispatch();
  const accordionItemRef = useRef();
  const {
    replyMessage,
    messageHistory,
    isDraftThread,
    isForPrint,
    viewCount,
  } = props;
  const {
    attachment,
    folderId,
    hasAttachments,
    recipientName,
    preloaded,
    readReceipt,
    sentDate,
    senderName,
    triageGroupName,
  } = messageHistory;
  const activeReplyDraftMessage = useSelector(
    state => state.sm.messageDetails?.message,
  );
  const draftMessageHistoryItem = useSelector(
    state => state.sm.draftDetails?.draftMessageHistory,
  );
  const accordionRef = useRef();
  const [hasListener, setHasListener] = useState(false);
  const messageHistoryRef = useRef([]);
  const viewCountRef = useRef();

  const isSentOrRead =
    folderId === DefaultFolders.SENT.id ||
    readReceipt === MessageReadStatus.READ;
  const fromMe =
    recipientName === triageGroupName ||
    activeReplyDraftMessage?.recipientName ===
      activeReplyDraftMessage?.triageGroupName ||
    draftMessageHistoryItem[0]?.recipientName ===
      draftMessageHistoryItem[0]?.triageGroupName;
  const from = fromMe
    ? 'Me'
    : `${senderName}` ||
      `${activeReplyDraftMessage?.senderName}` ||
      `${draftMessageHistoryItem[0]?.senderName}`;

  const handleExpand = isPreloaded => {
    if (!isPreloaded) {
      dispatch(
        markMessageAsReadInThread(replyMessage?.messageId, isDraftThread),
      );
    }
  };

  const accordionAriaLabel = useMemo(
    () => {
      return `${!isSentOrRead ? 'New ' : ''}message ${
        fromMe || replyMessage?.replyToName || messageHistory[0]?.senderName
          ? 'sent'
          : 'received'
      } ${dateFormat(sentDate, 'MMMM D, YYYY [at] h:mm a z')}, ${
        hasAttachments || attachment ? 'with attachment' : ''
      }from ${replyMessage?.senderName || messageHistory[0]?.senderName}.`;
    },
    [
      attachment,
      fromMe,
      hasAttachments,
      isSentOrRead,
      messageHistory,
      replyMessage?.replyToName,
      replyMessage?.senderName,
      sentDate,
    ],
  );

  // value for screen readers to indicate how many messages are being loaded
  const messagesLoaded = useMemo(
    () => {
      if (messageHistory?.length)
        return messageHistory?.length > viewCount
          ? 5
          : messageHistory.length - viewCount + 5;
      return null;
    },
    [viewCount, messageHistory],
  );

  useEffect(
    () => {
      messageHistoryRef.current = messageHistory;
      viewCountRef.current = viewCount;
    },
    [messageHistory, viewCount],
  );

  const expandListener = useCallback(
    () => {
      if (messageHistoryRef.current?.length) {
        messageHistoryRef.current.forEach((m, i) => {
          if (i < viewCountRef.current && !m.preloaded) {
            dispatch(markMessageAsReadInThread(m.messageId, isDraftThread));
          }
        });
      }
    },
    [messageHistoryRef, viewCountRef, dispatch, isDraftThread],
  );

  // shadow dom is not available on the first render, so we need to wait for it to be available
  // before we can add the event listener
  // event listener is requried as it is not handled by native event handler in <va-accordion>
  // this is a temporary solution until the <va-accordion> component is updated to handle this event
  useInterval(() => {
    if (!hasListener && accordionRef) {
      const button = accordionRef.current?.shadowRoot?.querySelector('button');
      if (button) {
        button.addEventListener('click', () => {
          expandListener();
        });
        setHasListener(true);
      }
    }
  }, 500);

  useEffect(
    () => {
      return () => {
        dispatch(clearMessageHistory());
      };
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (viewCount > 5) {
        focusElement(
          `[data-testid="expand-message-button-${
            messageHistory[viewCount - 5].messageId
          }"]`,
        );
      }
    },
    [viewCount, messageHistory],
  );

  const setViewCount = count => {
    dispatch({ type: Actions.Message.SET_THREAD_VIEW_COUNT, payload: count });
  };

  const handleLoadMoreMessages = () => {
    setViewCount(viewCount + 5);
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      // prevent from scrolling to the footer
      e.preventDefault();
      handleLoadMoreMessages();
    }
  };

  return (
    <>
      {messageHistory === undefined && (
        <va-loading-indicator message="Loading message history..." />
      )}

      <section
        aria-label={
          replyMessage && messageHistory?.length > 0
            ? `${messageHistory?.length + 1} Messages in this conversation`
            : (isDraftThread && messageHistory?.length > 0
                ? `${messageHistory?.length} Messages in this conversation`
                : '1 Message in this conversation') ||
              (isDraftThread === false && '1 Message in this conversation')
        }
        className={`older-messages vads-u-margin-top--3 vads-u-padding-left--0p5 ${
          isForPrint ? 'print' : 'do-not-print'
        }`}
      >
        <h2 className="messages-in-conversation vads-u-font-weight--bold vads-u-margin-bottom--0p5">
          {replyMessage && messageHistory?.length > 0
            ? `${messageHistory?.length + 1} Messages in this conversation`
            : ((!!isDraftThread === true || !!isDraftThread === false) &&
              messageHistory?.length > 0
                ? `${messageHistory?.length + 1} Messages in this conversation`
                : '1 Message in this conversation') ||
              (!!isDraftThread === false && '1 Message in this conversation')}
        </h2>
        <VaAccordion ref={accordionRef} bordered>
          <VaAccordionItem
            data-dd-privacy="mask" // need to mask entire accordion as the subheader with the sender name cannot masked
            aria-label={accordionAriaLabel}
            className={`most-recent-message ${
              isSentOrRead ? 'accordion-unread' : 'accordion-read'
            }`}
            open="true"
            ref={accordionItemRef}
            subheader={from}
            onAccordionItemToggled={() => {
              handleExpand(preloaded);
            }}
            data-testid={
              (replyMessage &&
                `expand-message-button-${replyMessage?.messageId}`) ||
              (activeReplyDraftMessage &&
                `expand-message-button-${
                  activeReplyDraftMessage?.messageId
                }`) ||
              (!!draftMessageHistoryItem[0] &&
                `expand-message-button-${
                  draftMessageHistoryItem[0]?.messageId
                }`)
            }
          >
            <h3 slot="headline">
              {!!draftMessageHistoryItem === false &&
                dateFormat(
                  activeReplyDraftMessage?.sentDate,
                  'MMMM D [at] h:mm a z',
                )}
              {draftMessageHistoryItem &&
                dateFormat(
                  draftMessageHistoryItem[0]?.sentDate,
                  'MMMM D [at] h:mm a z',
                )}
            </h3>
            {isSentOrRead && (
              <i
                role="img"
                aria-hidden
                data-testid="unread-icon"
                className="vads-u-color--primary vads-u-padding--0p25 vads-u-margin-right--1 fas fa-solid fa-circle fa-xs"
                slot="icon"
                alt="Unread message icon"
              />
            )}
            {(!!replyMessage?.attachments ||
              activeReplyDraftMessage?.attachments) && (
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
                replyMessage={replyMessage}
                activeReplyDraftMessage={activeReplyDraftMessage}
                draftMessageHistoryItem={draftMessageHistoryItem}
                fromMe={fromMe}
              />
              <HorizontalRule />
              <MessageThreadBody
                text={
                  replyMessage?.messageBody ||
                  activeReplyDraftMessage?.messageBody ||
                  draftMessageHistoryItem[0]?.messageBody
                }
              />
              {replyMessage?.attachments?.length > 0 && (
                <MessageThreadAttachments
                  attachments={replyMessage?.attachments}
                />
              )}
            </div>
          </VaAccordionItem>
          {messageHistory.map((m, i) => {
            return (
              i < viewCount && (
                <MessageThreadItem
                  key={m.messageId}
                  message={m}
                  isDraftThread={isDraftThread}
                  preloaded={m.preloaded}
                  expanded
                  isSentOrRead={isSentOrRead}
                  accordionAriaLabel={accordionAriaLabel}
                />
              )
            );
          })}
        </VaAccordion>

        {viewCount < messageHistory?.length && (
          <div className="vads-u-margin-top--1 vads-l-row vads-u-justify-content--flex-start">
            {/* Per design decision it was determined to use a link instead of a button */}
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
              aria-label="Load 5 more messages"
              role="button"
              tabIndex="0"
              onKeyPress={handleKeyPress}
              onClick={handleLoadMoreMessages}
            >
              + 5 more messages
            </a>
          </div>
        )}

        {viewCount > 6 && (
          <div
            // announce to screen readers that more messages have been loaded
            aria-live="polite"
            role="alert"
            aria-label={`${messagesLoaded} more message${
              messagesLoaded > 1 ? 's are' : ' is'
            } loaded. Continue to navigate to the next message`}
          />
        )}
      </section>
    </>
  );
};

MessageThread.propTypes = {
  isDraftThread: PropType.bool,
  isForPrint: PropType.bool,
  messageHistory: PropType.array,
  replyMessage: PropType.object,
  viewCount: PropType.number,
};

export default MessageThread;
