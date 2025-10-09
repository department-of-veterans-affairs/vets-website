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
  return {
    meta: { method: 'keyboard' },
    payload: {
      activity: {
        channelData: { postBack: true },
        name: START_CONVERSATION,
        type: EVENT,
        value: {
          code: value.code,
          currentConversationId: value.currentConversationId,
          isMobile: value.isMobile,
        },
      },
    },
    type: POST_ACTIVITY,
  };
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

// Public helper used by Bot.jsx to replay both stored utterances (if present)
export function replayStoredUtterances(dispatch) {
  const utterances = getRecentUtterances();
  if (utterances && Array.isArray(utterances)) {
    // send in original chronological order
    utterances.forEach(u => {
      if (u && u.length) {
        dispatch(createSendMessageActivity(u));
      }
    });
    setRecentUtterances([]);
  }
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

function handleSignInEvent(action) {
  const actionEventName = getEventName(action);
  if (actionEventName === ACTIVITY_EVENT_NAMES.SIGN_IN_TRIGGER) {
    setIsTrackingUtterances(false);
    sendWindowEventWithActionPayload('webchat-auth-activity', action);
  }
}

function handleGreetingEvent(action, dispatch) {
  const actionEventName = getEventName(action);
  const eventValue = getEventValue(action);
  if (actionEventName === ACTIVITY_EVENT_NAMES.GREETING_TRIGGER && eventValue) {
    resetUtterances(dispatch);
  }
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

// define thunks for actions
export const processActionConnectFulfilled = ({
  dispatch,
  ...options
}) => () => {
  const currentConversationId = getConversationIdKey();
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
  const isAtBeginningOfConversation = !getIsTrackingUtterances();
  const data = action.payload.activity;
  const isFormPostButton = data.value?.type === 'FormPostButton';
  const isCSATSurveyResponse = data.valueType === 'CSATSurveyResponse';

  if (isAtBeginningOfConversation) {
    setIsTrackingUtterances(true);
  }

  handleSignInEvent(action);
  handleGreetingEvent(action, dispatch);

  if (isComponentToggleOn && isFormPostButton) {
    submitForm(data.value.url, data.value.body);
  }

  if (isCSATSurveyResponse) {
    processCSAT(data);
  }

  const trackingUtterances = getIsTrackingUtterances();
  if (trackingUtterances) {
    sendWindowEventWithActionPayload('webchat-message-activity', action);
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
