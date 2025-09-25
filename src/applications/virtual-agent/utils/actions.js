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

function handleRagAgentLLMEvent(action) {
  const actionEventName = getEventName(action);
  const eventValue = getEventValue(action);

  if (actionEventName === ACTIVITY_EVENT_NAMES.AGENT_LLM_RESPONSE) {
    const intent = eventValue.intent || 'Unknown';
    const response = eventValue.parsed || {};
    const hasLinks = response.message
      ? /\[([^\]]*)\]\(([^)]+)\)/g.test(response.message)
      : false;
    const linkCount = hasLinks
      ? (response.message.match(/\[([^\]]*)\]\(([^)]+)\)/g) || []).length
      : 0;

    recordEvent({
      event: EVENT_API_CALL,
      'api-name': API_CALL_NAMES.RAG_AGENT_RESPONSE,
      'api-status': 'successful',
      'api-request-id': eventValue.utteranceId || undefined,
      // Optional analytics fields (non-PII)
      'skill-name': intent,
      'response-type': hasLinks ? 'with_links' : 'plain_text',
      'link-count': linkCount,
      answerable: response.answerable || false,
      complete: response.complete || false,
    });
  }
}

function handleSignInLLMEvents(action) {
  const actionEventName = getEventName(action);
  const eventValue = getEventValue(action);

  // Track Sign-In Support specific LLM interactions (Agent only)
  if (
    actionEventName === ACTIVITY_EVENT_NAMES.AGENT_LLM_RESPONSE &&
    (eventValue.intent === 'Sign-In Support' ||
      eventValue.parsed?.items?.some(item => item.topic === 'Sign-In Support'))
  ) {
    recordEvent({
      event: EVENT_API_CALL,
      'api-name': API_CALL_NAMES.SIGNIN_RESPONSE,
      'api-status': 'successful',
      'api-request-id': eventValue.utteranceId || undefined,
      'skill-name': 'Sign-In Support',
    });
  }
}

function handleSemanticSearchEvent(action) {
  const actionEventName = getEventName(action);
  const eventValue = getEventValue(action);

  if (actionEventName === ACTIVITY_EVENT_NAMES.AGENT_SEMANTIC_SEARCH_RESPONSE) {
    const intent = eventValue.intent || 'Router';
    const resultCount = eventValue.parsed?.length || 0;

    recordEvent({
      event: EVENT_API_CALL,
      'api-name': API_CALL_NAMES.SEMANTIC_SEARCH_AGENT,
      'api-status': 'successful',
      'api-request-id': eventValue.utteranceId || undefined,
      // Optional analytics fields (non-PII)
      'skill-name': intent,
      'result-count': resultCount,
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
  const isMessageFromBot =
    data.type === 'message' && data.text && data.from.role === 'bot';
  const isFormPostButton = data.value?.type === 'FormPostButton';
  const isCSATSurveyResponse = data.valueType === 'CSATSurveyResponse';

  if (isAtBeginningOfConversation) {
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
  handleRagAgentLLMEvent(action);
  handleSignInLLMEvents(action);
  handleSemanticSearchEvent(action);
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
