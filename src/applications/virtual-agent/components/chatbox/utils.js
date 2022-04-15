export const LOGGED_IN_FLOW = 'loggedInFlow';
export const IN_AUTH_EXP = 'inAuthExperience';
export const RECENT_UTTERANCES = 'recentUtterances';

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
      // console.log('session storage null');
      utterances = ['', ''];
    } else {
      // console.log('session storage has something');
      utterances = JSON.parse(sessionStorage.getItem(RECENT_UTTERANCES));
    }

    utterances.push(data.text);
    utterances.shift();
    sessionStorage.setItem(RECENT_UTTERANCES, JSON.stringify(utterances));
    // console.log('updated storage :', sessionStorage.getItem(RECENT_UTTERANCES));
  }
}
