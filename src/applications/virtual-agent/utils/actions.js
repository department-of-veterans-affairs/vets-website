import * as _ from 'lodash';

import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';

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
  const apiName = `Chatbot Skill Entry - ${eventValue}`;
  if (actionEventName === 'Skill_Entry') {
    setEventSkillValue(eventValue);
    recordEvent({
      event: 'api_call',
      'api-name': apiName,
      topic: eventValue,
      'api-status': 'successful',
    });
  }
}

function handleSkillExitEvent(action) {
  const actionEventName = getEventName(action);
  const eventValue = getEventValue(action);
  const apiName = `Chatbot Skill Exit - ${eventValue}`;
  if (actionEventName === 'Skill_Exit') {
    recordEvent({
      event: 'api_call',
      'api-name': apiName,
      topic: eventValue,
      'api-status': 'successful',
    });
  }
}

function handleRouterLLMEvent(action) {
  const actionEventName = getEventName(action);
  const eventValue = getEventValue(action);

  if (actionEventName === 'RouterLLMResponse') {
    const utterance = eventValue.utterance || '';
    const topics = eventValue.parsed?.items || [];
    const topicNames = topics.map(item => item.topic).join(', ');

    recordEvent({
      event: 'chatbot_llm_interaction',
      'interaction-type': 'router_classification',
      'user-query': piiReplace(utterance).substring(0, 100),
      'classified-topics': topicNames,
      'topic-count': topics.length,
      'api-status': 'successful',
    });
  }
}

function handleRagAgentLLMEvent(action) {
  const actionEventName = getEventName(action);
  const eventValue = getEventValue(action);

  if (actionEventName === 'AgentLLMResponse') {
    const utterance = eventValue.utterance || '';
    const intent = eventValue.intent || 'Unknown';
    const response = eventValue.parsed || {};
    const hasLinks = response.message
      ? /\[([^\]]*)\]\(([^)]+)\)/g.test(response.message)
      : false;
    const linkCount = hasLinks
      ? (response.message.match(/\[([^\]]*)\]\(([^)]+)\)/g) || []).length
      : 0;

    recordEvent({
      event: 'chatbot_llm_interaction',
      'interaction-type': 'rag_response',
      'skill-name': intent,
      'user-query': piiReplace(utterance).substring(0, 100),
      'response-type': hasLinks ? 'with_links' : 'plain_text',
      'link-count': linkCount,
      answerable: response.answerable || false,
      complete: response.complete || false,
      'api-status': 'successful',
    });
  }
}

function handleSignInLLMEvents(action) {
  const actionEventName = getEventName(action);
  const eventValue = getEventValue(action);

  // Track Sign-In Support specific LLM interactions
  if (
    (actionEventName === 'AgentLLMResponse' ||
      actionEventName === 'RouterLLMResponse') &&
    (eventValue.intent === 'Sign-In Support' ||
      eventValue.parsed?.items?.some(item => item.topic === 'Sign-In Support'))
  ) {
    const utterance = eventValue.utterance || '';
    const interactionType =
      actionEventName === 'RouterLLMResponse'
        ? 'signin_classification'
        : 'signin_response';

    recordEvent({
      event: 'chatbot_signin_interaction',
      'interaction-type': interactionType,
      'user-query': piiReplace(utterance).substring(0, 100),
      'skill-name': 'Sign-In Support',
      'api-status': 'successful',
    });
  }
}

function handleSemanticSearchEvent(action) {
  const actionEventName = getEventName(action);
  const eventValue = getEventValue(action);

  if (
    actionEventName === 'RouterSemanticSearchResponse' ||
    actionEventName === 'AgentSemanticSearchResponse'
  ) {
    const utterance = eventValue.utterance || '';
    const intent = eventValue.intent || 'Router';
    const resultCount = eventValue.parsed?.length || 0;

    recordEvent({
      event: 'chatbot_semantic_search',
      'search-type':
        actionEventName === 'RouterSemanticSearchResponse' ? 'router' : 'agent',
      'skill-name': intent,
      'user-query': piiReplace(utterance).substring(0, 100),
      'result-count': resultCount,
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
  handleRouterLLMEvent(action);
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
