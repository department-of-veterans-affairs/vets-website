const BOT_SESSION_PREFIX = 'va-bot.';
const LOGGED_IN_FLOW = `${BOT_SESSION_PREFIX}loggedInFlow`;
const IN_AUTH_EXP = `${BOT_SESSION_PREFIX}inAuthExperience`;
const RECENT_UTTERANCES = `${BOT_SESSION_PREFIX}recentUtterances`;
const IS_RX_SKILL = `${BOT_SESSION_PREFIX}isRxSkill`;
const CONVERSATION_ID_KEY = `${BOT_SESSION_PREFIX}conversationId`;
const IS_TRACKING_UTTERANCES = `${BOT_SESSION_PREFIX}isTrackingUtterances`;
const TOKEN_KEY = `${BOT_SESSION_PREFIX}token`;
const SKILL_EVENT_VALUE = `${BOT_SESSION_PREFIX}skillEventValue`;

function setStorageItem(key, value, json = false) {
  if (json) {
    sessionStorage.setItem(key, JSON.stringify(value));
  } else {
    sessionStorage.setItem(key, value);
  }
}

function getStorageItem(key, json = false) {
  if (json) {
    return JSON.parse(sessionStorage.getItem(key));
  }
  return sessionStorage.getItem(key);
}

export function getLoggedInFlow() {
  return getStorageItem(LOGGED_IN_FLOW);
}

export function setLoggedInFlow(value) {
  setStorageItem(LOGGED_IN_FLOW, value);
}

export function getInAuthExp() {
  return getStorageItem(IN_AUTH_EXP);
}

export function setInAuthExp(value) {
  setStorageItem(IN_AUTH_EXP, value);
}

export function getRecentUtterances() {
  return getStorageItem(RECENT_UTTERANCES, true);
}

export function setRecentUtterances(value) {
  setStorageItem(RECENT_UTTERANCES, value, true);
}

export function getIsRxSkill() {
  return getStorageItem(IS_RX_SKILL);
}

export function setIsRxSkill(value) {
  setStorageItem(IS_RX_SKILL, value, true);
}

export function getEventSkillValue() {
  getStorageItem(SKILL_EVENT_VALUE);
}

export function setEventSkillValue(value) {
  setStorageItem(SKILL_EVENT_VALUE, value);
}

export function getConversationIdKey() {
  return getStorageItem(CONVERSATION_ID_KEY);
}

export function setConversationIdKey(value) {
  setStorageItem(CONVERSATION_ID_KEY, value);
}

export function getIsTrackingUtterances() {
  return getStorageItem(IS_TRACKING_UTTERANCES);
}

export function setIsTrackingUtterances(value) {
  setStorageItem(IS_TRACKING_UTTERANCES, value, true);
}

export function getTokenKey() {
  return getStorageItem(TOKEN_KEY);
}

export function setTokenKey(value) {
  setStorageItem(TOKEN_KEY, value);
}

export function clearBotSessionStorage(forceClear) {
  const botSessionKeys = Object.keys(sessionStorage);
  const loggedInFlow = getLoggedInFlow();
  const inAuthExp = getInAuthExp();
  const expectToClear = loggedInFlow !== 'true' && inAuthExp !== 'true';
  const excludeClear = [];

  // capture the canceled login scenarios [issue #479]
  if (!forceClear && loggedInFlow === 'true' && inAuthExp !== 'true') {
    excludeClear.push(LOGGED_IN_FLOW);
    excludeClear.push(RECENT_UTTERANCES);
    // in most scenarios, these will be reset anyway,
    // but preserved here for edge cases.
    excludeClear.push(CONVERSATION_ID_KEY);
    excludeClear.push(TOKEN_KEY);
  }

  if (forceClear || expectToClear || !!excludeClear.length) {
    botSessionKeys.forEach(sessionKey => {
      if (
        sessionKey.includes(BOT_SESSION_PREFIX) &&
        !excludeClear.includes(sessionKey)
      ) {
        sessionStorage.removeItem(sessionKey);
      }
    });
  }
}

export function storeUtterances(event) {
  // blindly store the last two user utterances for later use
  // if user is prompted to login. empty string means no utterance
  // for that array element. (means no null checks later)

  const { data } = event;
  if (
    data.type === 'message' &&
    data.text &&
    data.text.length > 0 &&
    data.from.role === 'user'
  ) {
    let utterances;
    const recentUtterances = getRecentUtterances();
    if (recentUtterances === null) {
      utterances = ['', ''];
    } else {
      utterances = recentUtterances;
    }

    utterances.push(data.text);
    utterances.shift();
    setRecentUtterances(utterances);
  }
}
