// some placeholder example jsdoc types

/**
 * @typedef {'GET'|'POST'|'PUT'|'PATCH'|'DELETE'} HttpMethod
 */

/**
 * @typedef {Object} SampleApiResponse
 * @property {boolean} success
 * @property {any} [data]
 * @property {string} [error]
 * @property {number} [statusCode]
 */

/**
 * @typedef {function(): void} VoidCallback
 */

/**
 * @typedef {function(Error): void} ErrorCallback
 */

// ─── Messaging types ───────────────────────────────────────────────────────

/**
 * Who sent a chat message.
 * @typedef {'user'|'va'|'system'} MessageSender
 */

/**
 * A quick reply option attached to a message.
 * @typedef {Object} ChatQuickReply
 * @property {string} text
 * @property {string} payload
 */

/**
 * A single message in the chat thread.
 * @typedef {Object} ChatMessage
 * @property {string} id - Unique message identifier
 * @property {MessageSender} sender - Who sent the message
 * @property {string} text - Message body text
 * @property {number} [timestamp] - Unix timestamp (ms)
 * @property {ChatQuickReply[]} [quickReplies] - Optional quick reply options for this message
 */

/**
 * WebSocket / API connection lifecycle states.
 * @typedef {'idle'|'connecting'|'connected'|'reconnecting'|'offline'|'error'|'disconnected'} ConnectionStatus
 */

/**
 * Configuration required to initialise the Genesys Headless Messenger SDK.
 * @typedef {Object} GenesysConfig
 * @property {string} deploymentId - Genesys deployment identifier
 * @property {string} region - Genesys Cloud region (e.g. 'prod-useast1')
 */

/**
 * Deployment configuration returned by GenesysJS.configuration.
 * @typedef {Object<string, any>} GenesysDeploymentConfiguration
 */

/**
 * Callbacks passed to GenesysService.init().
 * @typedef {Object} GenesysServiceCallbacks
 * @property {function(ChatMessage): void} [onMessageReceived]
 * @property {function(ChatMessage[]): void} [onMessagesReceived]
 * @property {function(ChatMessage[]): void} [onRestored]
 * @property {function(Object): void} [onStarted]
 * @property {function(Object): void} [onReady]
 * @property {function(GenesysDeploymentConfiguration): void} [onConfiguration]
 * @property {function(string): void} [onError]
 * @property {function(): void} [onDisconnected]
 * @property {function(boolean): void} [onTypingIndicator]
 * @property {function(ConnectionStatus): void} [onConnectionStatus]
 */
