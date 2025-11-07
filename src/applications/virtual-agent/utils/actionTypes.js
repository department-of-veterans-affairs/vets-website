// Action type constants to avoid magic strings and enable reuse across middleware
// These values mirror the BotFramework Web Chat and DirectLine Redux action types.

/** Web Chat: dispatched when user sends a message */
export const WEB_CHAT_SEND_MESSAGE = 'WEB_CHAT/SEND_MESSAGE';

/** Direct Line: dispatched when posting any activity to the bot */
export const DIRECT_LINE_POST_ACTIVITY = 'DIRECT_LINE/POST_ACTIVITY';

/** Direct Line: connection established */
export const DIRECT_LINE_CONNECT_FULFILLED = 'DIRECT_LINE/CONNECT_FULFILLED';

/** Direct Line: incoming activity received */
export const DIRECT_LINE_INCOMING_ACTIVITY = 'DIRECT_LINE/INCOMING_ACTIVITY';
