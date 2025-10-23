import * as _ from 'lodash';

import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';

import {
  EVENT_API_CALL,
  ACTIVITY_EVENT_NAMES,
  API_CALL_NAMES,
} from './analyticsConstants';
import piiReplace from './piiReplace';
import {
  getConversationIdKey,
  getInAuthExp,
  getIsTrackingUtterances,
  getRecentUtterances,
  setEventSkillValue,
  setIsTrackingUtterances,
  setRecentUtterances,
} from './sessionStorage';
import { sendWindowEventWithActionPayload } from './events';
import submitForm from './submitForm';
import processCSAT from './processCSAT';

const START_CONVERSATION = 'startConversation';
const EVENT = 'event';
const POST_ACTIVITY = 'DIRECT_LINE/POST_ACTIVITY';

function getStartConversationActivity(value) {
  const valuePayload = {
    code: value.code,
    isMobile: value.isMobile,
  };
  if (value.currentConversationId) {
    valuePayload.currentConversationId = value.currentConversationId;
  }
  return {
    meta: { method: 'keyboard' },
    payload: {
      activity: {
        channelData: { postBack: true },
        name: START_CONVERSATION,
        type: EVENT,
        value: valuePayload,
      },
    },
    type: POST_ACTIVITY,
  };
}

function getEventName(action) {
  return action?.payload?.activity?.name ?? '';
}

function getEventValue(action) {
  return (
    action?.payload?.activity?.value?.value ||
    action?.payload?.activity?.value ||
    ''
  );
}

function handleSkillEntryEvent(action) {
  const actionEventName = getEventName(action);
  const eventValue = getEventValue(action);
  const apiName = `${API_CALL_NAMES.SKILL_ENTRY} - ${eventValue}`;
  if (actionEventName === ACTIVITY_EVENT_NAMES.SKILL_ENTRY) {
    setEventSkillValue(eventValue);
    recordEvent({
      event: EVENT_API_CALL,
      'api-name': apiName,
      'api-status': 'successful',
    });
  }
}

function handleSkillExitEvent(action) {
  const actionEventName = getEventName(action);
  const eventValue = getEventValue(action);
  const apiName = `${API_CALL_NAMES.SKILL_EXIT} - ${eventValue}`;
  if (actionEventName === ACTIVITY_EVENT_NAMES.SKILL_EXIT) {
    recordEvent({
      event: EVENT_API_CALL,
      'api-name': apiName,
      'api-status': 'successful',
    });
  }
}

// Track RAG Agent Entry based on bot RAG_ENTRY event
function handleRagAgentEntryEvent(action) {
  const actionEventName = getEventName(action);
  const skillName = getEventValue(action);
  const apiName = `${API_CALL_NAMES.RAG_AGENT_ENTRY} - ${skillName}`;

  if (actionEventName === ACTIVITY_EVENT_NAMES.RAG_ENTRY) {
    recordEvent({
      event: EVENT_API_CALL,
      'api-name': apiName,
      'api-status': 'successful',
    });
  }
}

// Emit a RAG Agent Exit based on bot RAG_EXIT event
function handleRagAgentExitEvent(action) {
  const actionEventName = getEventName(action);
  const eventValue = getEventValue(action);
  const apiName = `${API_CALL_NAMES.RAG_AGENT_EXIT} - ${eventValue}`;
  if (actionEventName === ACTIVITY_EVENT_NAMES.RAG_EXIT) {
    recordEvent({
      event: EVENT_API_CALL,
      'api-name': apiName,
      'api-status': 'successful',
    });
  }
}

function createSendMessageActivity(newUtterance) {
  return {
    type: 'WEB_CHAT/SEND_MESSAGE',
    payload: { type: 'message', text: newUtterance },
  };
}

function resetUtterances(dispatch) {
  const utterances = getRecentUtterances();
  const utterance = utterances ? utterances[0] : undefined;
  if (utterance) {
    dispatch(createSendMessageActivity(utterance));
    // Reset utterance array
    setRecentUtterances([]);
  }
}

// define thunks for actions
export const processActionConnectFulfilled = ({
  dispatch,
  isSessionPersistenceEnabled,
  ...options
}) => () => {
  const currentConversationId = isSessionPersistenceEnabled
    ? getConversationIdKey()
    : undefined;
  const startConversationActivity = getStartConversationActivity({
    ...options,
    currentConversationId,
  });

  dispatch(startConversationActivity);
};

export const processSendMessageActivity = ({ action }) => () => {
  _.assign(action.payload, { text: piiReplace(action.payload.text) });
  const outgoingActivityEvent = new Event('bot-outgoing-activity');
  window.dispatchEvent(outgoingActivityEvent);
};

export const processIncomingActivity = ({
  action,
  dispatch,
  isComponentToggleOn,
}) => () => {
  const data = action.payload.activity;
  const isMessageFromBot =
    data.type === 'message' && data.text && data.from.role === 'bot';
  const isFormPostButton = data.value?.type === 'FormPostButton';
  const isCSATSurveyResponse = data.valueType === 'CSATSurveyResponse';

  if (!getIsTrackingUtterances()) {
    setIsTrackingUtterances(true);
  }

  if (isMessageFromBot) {
    const botWantsToSignInUser = data.text.includes(
      'Alright. Sending you to the sign-in page...',
    );

    const inAuthExp = getInAuthExp();
    const isNewAuthedConversation =
      data.text.includes('To get started') && inAuthExp === 'true';

    if (botWantsToSignInUser) {
      setIsTrackingUtterances(false);
      sendWindowEventWithActionPayload('webchat-auth-activity', action);
    } else if (isNewAuthedConversation) {
      resetUtterances(dispatch);
    }
  }

  const trackingUtterances = getIsTrackingUtterances();
  if (trackingUtterances) {
    sendWindowEventWithActionPayload('webchat-message-activity', action);
  }

  if (isComponentToggleOn && isFormPostButton) {
    submitForm(data.value.url, data.value.body);
  }

  if (isCSATSurveyResponse) {
    try {
      // Defer to next frame to allow Adaptive Card DOM to render
      requestAnimationFrame(() => {
        try {
          processCSAT(data);
        } catch (e) {
          // Safeguard to prevent crashing the chat UI
          // eslint-disable-next-line no-console
          console.warn('CSAT processing error (deferred):', e);
        }
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('CSAT processing error:', e);
    }
  }

  handleSkillEntryEvent(action);
  handleSkillExitEvent(action);
  handleRagAgentEntryEvent(action);
  handleRagAgentExitEvent(action);
};

export function addActivityData(action, { isMobile }) {
  const updatedAction = action;
  if (updatedAction.payload?.activity) {
    if (typeof updatedAction.payload.activity.value === 'string') {
      updatedAction.payload.activity.value = {
        value: updatedAction.payload.activity.value,
        isMobile,
      };
    } else {
      updatedAction.payload.activity.value = {
        ...updatedAction.payload.activity.value,
        isMobile,
      };
    }
  }
  return updatedAction;
}
