const BOT_SESSION_PREFIX = 'va-bot.';
export const LOGGED_IN_FLOW = `${BOT_SESSION_PREFIX}loggedInFlow`;
export const IN_AUTH_EXP = `${BOT_SESSION_PREFIX}inAuthExperience`;
export const RECENT_UTTERANCES = `${BOT_SESSION_PREFIX}recentUtterances`;
export const CONVERSATION_ID_KEY = `${BOT_SESSION_PREFIX}conversationId`;
export const IS_TRACKING_UTTERANCES = `${BOT_SESSION_PREFIX}isTrackingUtterances`;
export const IS_RX_SKILL = `${BOT_SESSION_PREFIX}isRxSkill`;
export const TOKEN_KEY = `${BOT_SESSION_PREFIX}token`;

const RX_UTTERANCE_1 = 'refill prescription';
const RX_UTTERANCE_2 = 'rx';
const RX_UTTERANCE_3 = 'prescription status';
const RX_UTTERANCE_4 = 'prescription';
const RX_UTTERANCE_5 = 'Can I refill my prescription?';
const RX_UTTERANCE_6 = 'rxrefill';
const RX_UTTERANCE_7 = 'sandbox 3';

export const RX_UTTERANCES = [
  RX_UTTERANCE_1,
  RX_UTTERANCE_2,
  RX_UTTERANCE_3,
  RX_UTTERANCE_4,
  RX_UTTERANCE_5,
  RX_UTTERANCE_6,
  RX_UTTERANCE_7,
];

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
