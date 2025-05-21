import React from 'react';
import PropTypes from 'prop-types';
import { dateFormat } from '../../util/helpers';
import useFeatureToggles from '../../hooks/useFeatureToggles';

const MessageThreadMeta = props => {
  const { message, isSent, forPrint } = props;

  const { readReceiptsEnabled } = useFeatureToggles();
  const {
    recipientName,
    senderName,
    triageGroupName,
    suggestedNameDisplay,
    messageId,
    sentDate,
    readReceipt,
  } = message;

  const readReceiptMessage =
    readReceipt === null
      ? 'Not yet opened by your care team'
      : 'Opened by your care team';

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
            {`${senderName}${
              !isSent ? ` (${suggestedNameDisplay || triageGroupName})` : ''
            }`}
          </span>
        </p>
        <p
          className="vads-u-padding-right--2 vads-u-margin-y--0p5"
          data-testid={!forPrint ? 'to' : 'draftTo'}
        >
          <>To: </>
          <span data-dd-privacy="mask">
            {(isSent && suggestedNameDisplay) || recipientName}
          </span>
        </p>
        {readReceiptsEnabled ? (
          isSent && (
            <p className="vads-u-font-weight--bold">{readReceiptMessage}</p>
          )
        ) : (
          <p
            className="vads-u-margin-y--0p5"
            data-testid={!forPrint ? 'message-id' : ''}
          >
            <>Message ID: </>
            <span data-dd-privacy="mask">{messageId}</span>
          </p>
        )}
      </div>
    </div>
  );
};

MessageThreadMeta.propTypes = {
  isSent: PropTypes.bool.isRequired,
  activeReplyDraftMessage: PropTypes.object,
  draftMessageHistoryItem: PropTypes.array,
  forPrint: PropTypes.bool,
  message: PropTypes.object,
  replyMessage: PropTypes.object,
};

export default MessageThreadMeta;
