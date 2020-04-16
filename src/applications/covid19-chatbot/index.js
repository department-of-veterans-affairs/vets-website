import 'botframework-webchat';

const defaultLocale = 'en-US';
const localeRegExPattern = /^[a-z]{2}(-[A-Z]{2})?$/;
let chatBotScenario = 'unknown';
let root = null;

function extractLocale(localeParam) {
  if (localeParam === 'autodetect') {
    return navigator.language;
  }

  // Before assigning, ensure it's a valid locale string (xx or xx-XX)
  if (localeParam.search(localeRegExPattern) === 0) {
    return localeParam;
  }
  return defaultLocale;
}

function getUserLocation(callback) {
  navigator.geolocation.getCurrentPosition(
    position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const location = {
        lat: latitude,
        long: longitude,
      };
      callback(location);
    },
    error => {
      // user declined to share location
      // eslint-disable-next-line no-console
      console.log(`location error:${error.message}`);
      callback();
    },
  );
}

function startChat(user, webchatOptions) {
  window.WebChat.renderWebChat(webchatOptions, root);
}

function initBotConversation() {
  if (this.status >= 400) {
    alert(this.statusText);
    return;
  }
  // extract the data from the JWT
  const jsonWebToken = this.response;
  const tokenPayload = JSON.parse(atob(jsonWebToken.split('.')[1]));
  const user = {
    id: tokenPayload.userId,
    name: tokenPayload.userName,
    locale: tokenPayload.locale,
  };
  let domain = undefined;
  if (tokenPayload.directLineURI) {
    domain = `https://${tokenPayload.directLineURI}/v3/directline`;
  }
  const botConnection = window.WebChat.createDirectLine({
    token: tokenPayload.connectorToken,
    domain,
  });
  const styleOptions = {
    hideSendBox: true,
    botAvatarInitials: 'VA',
    userAvatarInitials: 'You',
    backgroundColor: '#F8F8F8',
    primaryFont: 'Source Sans Pro, sans-serif',
  };

  const webchatStore = window.WebChat.createStore(
    {},
    store => next => action => {
      if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
        store.dispatch({
          type: 'DIRECT_LINE/POST_ACTIVITY',
          meta: { method: 'keyboard' },
          payload: {
            activity: {
              type: 'invoke',
              name: 'InitConversation',
              locale: user.locale,
              value: {
                // must use for authenticated conversation.
                jsonWebToken,

                // Use the following activity to proactively invoke a bot scenario

                triggeredScenario: {
                  trigger: chatBotScenario,
                },
              },
            },
          },
        });
      } else if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
        if (
          action.payload &&
          action.payload.activity &&
          action.payload.activity.type === 'event' &&
          action.payload.activity.name === 'ShareLocationEvent'
        ) {
          // share
          getUserLocation(location => {
            store.dispatch({
              type: 'WEB_CHAT/SEND_POST_BACK',
              payload: { value: JSON.stringify(location) },
            });
          });
        }
        setTimeout(() => {
          document.querySelector(
            'div.css-y1c0xs',
          ).scrollTop = document.querySelector('div.css-y1c0xs').scrollHeight;
        });
      }
      return next(action);
    },
  );
  const webchatOptions = {
    directLine: botConnection,
    styleOptions,
    store: webchatStore,
    userID: user.id,
    username: user.name,
    locale: user.locale,
  };
  startChat(user, webchatOptions);
}

function requestChatBot(loc) {
  const params = new URLSearchParams(location.search);
  const locale = params.has('locale')
    ? extractLocale(params.get('locale'))
    : defaultLocale;
  const oReq = new XMLHttpRequest();
  oReq.addEventListener('load', initBotConversation);
  let path = `https://va-covid19-chatbot-dev.azurewebsites.net/chatBot?locale=${locale}`;

  if (loc) {
    path += `&lat=${loc.lat}&long=${loc.long}`;
  }
  if (params.has('userId')) {
    path += `&userId=${params.get('userId')}`;
  }
  if (params.has('userName')) {
    path += `&userName=${params.get('userName')}`;
  }
  oReq.open('POST', path);
  // add Access-Control-Allow-Origin header on POST
  oReq.setRequestHeader('Access-Control-Allow-Origin', '*');
  oReq.send();
}

function chatRequested(scenario) {
  chatBotScenario = scenario;
  const params = new URLSearchParams(location.search);
  if (params.has('shareLocation')) {
    getUserLocation(requestChatBot);
  } else {
    requestChatBot();
  }
}

export default function initializeChatbot(_root) {
  root = _root;
  chatRequested('va_covid_chatbot_wrapper');
}
