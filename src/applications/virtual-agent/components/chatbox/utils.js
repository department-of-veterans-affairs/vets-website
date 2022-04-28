const BOT_SESSION_PREFIX = 'va-bot.';
export const LOGGED_IN_FLOW = `${BOT_SESSION_PREFIX}loggedInFlow`;
export const IN_AUTH_EXP = `${BOT_SESSION_PREFIX}inAuthExperience`;
export const RECENT_UTTERANCES = `${BOT_SESSION_PREFIX}recentUtterances`;
export const CONVERSATION_ID_KEY = `${BOT_SESSION_PREFIX}conversationId`;
export const TOKEN_KEY = `${BOT_SESSION_PREFIX}token`;

export function clearBotSessionStorage(forceClear) {
  const keys = Object.keys(sessionStorage);
  const loggedInFlow = sessionStorage.getItem(LOGGED_IN_FLOW);
  const inAuthExp = sessionStorage.getItem(IN_AUTH_EXP);
  const expectToClear = loggedInFlow !== 'true' && inAuthExp !== 'true';

  if (forceClear || expectToClear) {
    for (let i = 0; i < keys.length; i++) {
      if (keys[i].includes(BOT_SESSION_PREFIX)) {
        sessionStorage.removeItem(keys[i]);
      }
    }
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
