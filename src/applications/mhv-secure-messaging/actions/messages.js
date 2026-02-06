import moment from 'moment-timezone';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { dataDogLogger } from 'platform/monitoring/Datadog';
import { Actions } from '../util/actionTypes';
import {
  getMessage,
  deleteMessageThread as deleteMessageCall,
  moveMessageThread as moveThreadCall,
  createMessage,
  createReplyToMessage,
  getMessageThreadWithFullBody,
} from '../api/SmApi';
import { addAlert } from './alerts';
import * as Constants from '../util/constants';
import {
  getLastSentMessage,
  isOlderThan,
  decodeHtmlEntities,
} from '../util/helpers';
import { resetRecentRecipient } from './recipients';
import { setThreadRefetchRequired } from './threads';
import { clearPrescription } from './prescription';

export const clearThread = () => async dispatch => {
  dispatch({ type: Actions.Thread.CLEAR_THREAD });
};

/**
 * Call to mark message as read and trigger thread list refetch.
 * @param {Long} messageId - The ID of the message to mark as read
 * @returns {Promise<void>}
 *
 * Uses getMessage (single message) call to mark the message as read,
 * then sets refetchRequired to trigger a fresh fetch of the thread list
 * when navigating back to inbox.
 */
export const markMessageAsReadInThread = messageId => async dispatch => {
  const response = await getMessage(messageId);
  if (response.errors) {
    // TODO Add error handling
  } else {
    dispatch({
      type: Actions.Thread.GET_MESSAGE_IN_THREAD,
      response,
    });
    // Trigger refetch of thread list to get updated read status from API
    // This ensures the inbox shows the correct read status when navigating back
    dispatch(setThreadRefetchRequired(true));
  }
};

/**
 * Retrieves full message thread that includes full body text, attachments, drafts etc..
 * @param {Long} messageId
 * @param {Boolean} isDraft true if the message is a draft, otherwise false
 * @param {Boolean} refresh true if the refreshing a thread on a current view, to avoid clearing redux state and triggering spinning circle
 * @returns
 *
 */
export const retrieveMessageThread = messageId => async dispatch => {
  try {
    dispatch(clearThread());
    const response = await getMessageThreadWithFullBody({ messageId });

    // finding last sent message in a thread to check if it is not too old for replies
    const lastSentDate = getLastSentMessage(response.data)?.attributes.sentDate;

    const drafts = response.data
      .filter(m => m.attributes.draftDate !== null)
      .sort(
        (a, b) =>
          moment(a.attributes.draftDate).isSameOrBefore(b.attributes.draftDate)
            ? 1
            : -1,
      );
    const messages = response.data.filter(m => m.attributes.sentDate !== null);

    const replyToName =
      response.data
        .find(m => m.attributes.triageGroupName !== m.attributes.recipientName)
        ?.attributes.senderName.trim() ||
      response.data[0].attributes.triageGroupName;

    const threadFolderId =
      response.data
        .find(m => m.attributes.triageGroupName !== m.attributes.recipientName)
        ?.attributes.folderId.toString() ||
      response.data[0].attributes.folderId;

    const replyDisabled = response.data.some(
      m => m.attributes.replyDisabled === true,
    );

    const { isOhMessage } = response.data[0].attributes;

    dispatch({
      type: Actions.Thread.GET_THREAD,
      payload: {
        replyToName,
        threadFolderId,
        isStale: isOlderThan(lastSentDate, 45),
        replyDisabled,
        cannotReply: isOlderThan(lastSentDate, 45) || replyDisabled,
        replyToMessageId: response.data[0].attributes.messageId,
        drafts: drafts.map(m => ({
          ...m.attributes,
          body: decodeHtmlEntities(m.attributes.body),
          messageBody: decodeHtmlEntities(m.attributes.body),
        })),
        messages: messages.map(m => ({
          ...m.attributes,
          body: decodeHtmlEntities(m.attributes.body),
          messageBody: decodeHtmlEntities(m.attributes.body),
        })),
        isOhMessage,
      },
    });
  } catch (e) {
    const errorMessage =
      e.errors[0].status === '404'
        ? Constants.Alerts.Thread.THREAD_NOT_FOUND_ERROR
        : e.errors[0]?.detail;
    if (errorMessage) {
      dispatch(addAlert(Constants.ALERT_TYPE_ERROR, '', errorMessage));
    }
    throw e;
  }
};

/**
 * @param {Long} threadId
 *  * @param {Long} folderId
 * @returns
 */
export const deleteMessage = threadId => async dispatch => {
  try {
    await deleteMessageCall(threadId);
    dispatch({ type: Actions.Message.DELETE_SUCCESS });
  } catch (e) {
    // const error = e.errors[0].detail;
    dispatch(
      addAlert(
        Constants.ALERT_TYPE_ERROR,
        '',
        Constants.Alerts.Message.DELETE_MESSAGE_ERROR,
      ),
    );
    throw e;
  }
};

/**
 * @param {Long} threadId
 * @param {Long} folderId
 * @returns
 */
export const moveMessageThread = (threadId, folderId) => async dispatch => {
  dispatch({ type: Actions.Message.MOVE_REQUEST });
  try {
    await moveThreadCall(threadId, folderId);
  } catch (e) {
    dispatch({ type: Actions.Message.MOVE_FAILED });
    dispatch(
      addAlert(
        Constants.ALERT_TYPE_ERROR,
        '',
        Constants.Alerts.Message.MOVE_MESSAGE_THREAD_ERROR,
      ),
    );
    throw e;
  }
};

export const sendMessage = (
  message,
  attachments,
  ohTriageGroup = false,
  isRxRenewal = false,
) => async dispatch => {
  const messageData =
    typeof message === 'string' ? JSON.parse(message) : message;
  const startTimeMs = Date.now();
  try {
    const response = await createMessage(message, attachments, ohTriageGroup);

    // do not show success alert for prescription renewal messages
    // due to redirect to Medications page, where that success banner is displayed
    if (!isRxRenewal) {
      dispatch(
        addAlert(
          Constants.ALERT_TYPE_SUCCESS,
          '',
          Constants.Alerts.Message.SEND_MESSAGE_SUCCESS,
        ),
      );
    }

    if (isRxRenewal) {
      dataDogLogger({
        message: 'Prescription Renewal Message Sent',
        attributes: {
          messageId: response.data?.attributes?.messageId,
          recipientId: messageData?.recipient_id,
          category: messageData?.category,
          hasAttachments: attachments && attachments.length > 0,
        },
        status: 'info',
      });
      recordEvent({
        event: 'api_call',
        'api-name': 'Rx SM Renewal',
        'api-status': 'successful',
        'api-latency-ms': Date.now() - startTimeMs,
        'error-key': undefined,
      });
    }
    dispatch(resetRecentRecipient());
    dispatch(setThreadRefetchRequired(true));
    dispatch(clearPrescription());
  } catch (e) {
    const errorCode = e.errors?.[0]?.code;
    const errorDetail = e.errors?.[0]?.detail || e.message;

    if (isRxRenewal) {
      dataDogLogger({
        message: 'Prescription Renewal Message Send Failed',
        attributes: {
          recipientId: messageData?.recipient_id,
          category: messageData?.category,
          errorCode,
          errorDetail,
          hasAttachments: attachments && attachments.length > 0,
        },
        status: 'error',
        error: e,
      });
      recordEvent({
        event: 'api_call',
        'api-name': 'Rx SM Renewal',
        'api-status': 'fail',
        'api-latency-ms': Date.now() - startTimeMs,
        'error-key': errorCode,
      });
    }

    if (
      e.errors &&
      (errorCode === Constants.Errors.Code.BLOCKED_USER ||
        errorCode === Constants.Errors.Code.BLOCKED_USER2)
    ) {
      dispatch(
        addAlert(
          Constants.ALERT_TYPE_ERROR,
          '',
          Constants.Alerts.Message.BLOCKED_MESSAGE_ERROR,
        ),
      );
    } else if (
      e.errors &&
      errorCode === Constants.Errors.Code.ATTACHMENT_SCAN_FAIL
    ) {
      dispatch(
        addAlert(
          Constants.ALERT_TYPE_ERROR,
          Constants.Alerts.Headers.HIDE_ALERT,
          Constants.Alerts.Message.ATTACHMENT_SCAN_FAIL,
        ),
      );
    } else
      dispatch(
        addAlert(
          Constants.ALERT_TYPE_ERROR,
          '',
          Constants.Alerts.Message.SEND_MESSAGE_ERROR,
        ),
      );
    throw e;
  }
};

/** when sending a reply with an existing draft message, same draft message id is passed as a param query and in the body of the request
 * @param {Long} replyToId - the id of the message being replied to. If replying with a saved draft, this is the id of the draft message
 * @param {Object} message - contains "body" field. Add "draft_id" field if replying with a saved draft and pass messageId of the same draft message
 */

export const sendReply = ({
  replyToId,
  message,
  attachments,
  ohTriageGroup = false,
}) => async dispatch => {
  try {
    await createReplyToMessage(replyToId, message, attachments, ohTriageGroup);

    dispatch(
      addAlert(
        Constants.ALERT_TYPE_SUCCESS,
        '',
        Constants.Alerts.Message.SEND_MESSAGE_SUCCESS,
      ),
    );
    dispatch(resetRecentRecipient());
    dispatch(setThreadRefetchRequired(true));
  } catch (e) {
    if (
      e.errors &&
      (e.errors[0].code === Constants.Errors.Code.BLOCKED_USER ||
        e.errors[0].code === Constants.Errors.Code.BLOCKED_USER2)
    ) {
      dispatch(
        addAlert(
          Constants.ALERT_TYPE_ERROR,
          '',
          Constants.Alerts.Message.BLOCKED_MESSAGE_ERROR,
        ),
      );
    } else if (
      e.errors &&
      e.errors[0].code === Constants.Errors.Code.TG_NOT_ASSOCIATED
    ) {
      dispatch(addAlert(Constants.ALERT_TYPE_ERROR, '', e.errors[0].detail));
    } else if (
      e.errors &&
      e.errors[0].code === Constants.Errors.Code.ATTACHMENT_SCAN_FAIL
    ) {
      dispatch(
        addAlert(
          Constants.ALERT_TYPE_ERROR,
          Constants.Alerts.Headers.HIDE_ALERT,
          Constants.Alerts.Message.ATTACHMENT_SCAN_FAIL,
        ),
      );
    } else {
      dispatch(
        addAlert(
          Constants.ALERT_TYPE_ERROR,
          '',
          Constants.Alerts.Message.SEND_MESSAGE_ERROR,
        ),
      );
    }
    throw e;
  }
};
