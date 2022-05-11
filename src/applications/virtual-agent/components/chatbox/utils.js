const BOT_SESSION_PREFIX = 'va-bot.';
export const LOGGED_IN_FLOW = `${BOT_SESSION_PREFIX}loggedInFlow`;
export const IN_AUTH_EXP = `${BOT_SESSION_PREFIX}inAuthExperience`;
export const RECENT_UTTERANCES = `${BOT_SESSION_PREFIX}recentUtterances`;
export const CONVERSATION_ID_KEY = `${BOT_SESSION_PREFIX}conversationId`;
export const TOKEN_KEY = `${BOT_SESSION_PREFIX}token`;

export function clearBotSessionStorage(forceClear) {
  const botSessionKeys = Object.keys(sessionStorage);
  const loggedInFlow = sessionStorage.getItem(LOGGED_IN_FLOW);
  const inAuthExp = sessionStorage.getItem(IN_AUTH_EXP);
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
      // eslint-disable-next-line sonarjs/no-collapsible-if
      if (sessionKey.includes(BOT_SESSION_PREFIX)) {
        if (!excludeClear.includes(sessionKey)) {
          sessionStorage.removeItem(sessionKey);
        }
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
    if (sessionStorage.getItem(RECENT_UTTERANCES) == null) {
      utterances = ['', ''];
    } else {
      utterances = JSON.parse(sessionStorage.getItem(RECENT_UTTERANCES));
    }

    utterances.push(data.text);
    utterances.shift();
    sessionStorage.setItem(RECENT_UTTERANCES, JSON.stringify(utterances));
  }
}
