import React from 'react';
import PropTypes from 'prop-types';
import { dateFormat } from '../../util/helpers';

const MessageThreadMeta = props => {
  const {
    message,
    fromMe,
    replyMessage,
    activeReplyDraftMessage,
    draftMessageHistoryItem,
    forPrint,
  } = props;
  const { recipientName, senderName, triageGroupName, messageId, sentDate } =
    message ||
    replyMessage ||
    activeReplyDraftMessage ||
    draftMessageHistoryItem;

  return (
    <div className="message-thread-meta">
      <div>
        {sentDate !== null && (
          <p
            className="vads-u-margin-y--0p5"
            data-testid={!forPrint ? 'message-date' : ''}
          >
            <>Date: </>
            <span data-dd-privacy="mask">
              {dateFormat(sentDate, 'MMMM D, YYYY [at] h:mm a z')}
            </span>
          </p>
        )}
        <p
          className="vads-u-padding-right--2 vads-u-margin-y--0p5"
          data-testid={!forPrint ? 'from' : ''}
        >
          <>From: </>
          <span data-dd-privacy="mask">
            {draftMessageHistoryItem
              ? `${draftMessageHistoryItem[0]?.senderName} ${
                  !fromMe ? draftMessageHistoryItem[0]?.triageGroupName : ''
                }`
              : `${senderName} ${!fromMe ? `(${triageGroupName})` : ''}`}
          </span>
        </p>
        <p
          className="vads-u-padding-right--2 vads-u-margin-y--0p5"
          data-testid={!forPrint && !draftMessageHistoryItem ? 'to' : 'draftTo'}
        >
          <>To: </>
          <span data-dd-privacy="mask">
            {recipientName || draftMessageHistoryItem[0]?.recipientName}
          </span>
        </p>
        <p
          className="vads-u-margin-y--0p5"
          data-testid={!forPrint ? 'message-id' : ''}
        >
          <>Message ID: </>
          <span data-dd-privacy="mask">
            {messageId || draftMessageHistoryItem[0]?.messageId}
          </span>
        </p>
      </div>
    </div>
  );
};

MessageThreadMeta.propTypes = {
  fromMe: PropTypes.bool.isRequired,
  activeReplyDraftMessage: PropTypes.object,
  draftMessageHistoryItem: PropTypes.array,
  forPrint: PropTypes.bool,
  message: PropTypes.object,
  replyMessage: PropTypes.object,
};

export default MessageThreadMeta;
