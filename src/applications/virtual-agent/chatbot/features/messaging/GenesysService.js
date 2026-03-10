/** @typedef {import('../../../types/common.d').ChatMessage} ChatMessage */
/** @typedef {import('../../../types/common.d').GenesysConfig} GenesysConfig */
/** @typedef {import('../../../types/common.d').GenesysServiceCallbacks} GenesysServiceCallbacks */

/**
 * Singleton service that wraps the Genesys Cloud Headless Messenger SDK.
 *
 * This is the ONLY file that touches window.Genesys(). All other layers
 * communicate with Genesys through the callbacks provided to init().
 *
 * Message object structure: https://developer.genesys.cloud/commdigital/digital/webmessaging/websocketapi#outbound-messages
 *
 * Usage:
 *   const service = GenesysService.getInstance(config);
 *   await service.init(callbacks);
 *   await service.startConversation();
 *   await service.sendMessage('Hello');
 *   service.destroy();
 */
export class GenesysService {
  /** @type {GenesysService|null} */
  static _instance = null;

  /** @type {GenesysConfig} */
  _config;

  /** @type {GenesysServiceCallbacks|null} */
  _callbacks = null;

  /** @param {GenesysConfig} config */
  constructor(config) {
    this._config = config;
  }

  /**
   * Returns the singleton instance, creating it if needed.
   * @param {GenesysConfig} config
   * @returns {GenesysService}
   */
  static getInstance(config) {
    if (!GenesysService._instance) {
      GenesysService._instance = new GenesysService(config);
    }
    return GenesysService._instance;
  }

  /**
   * Destroys the singleton instance. Required for test cleanup.
   */
  static resetInstance() {
    GenesysService._instance = null;
  }

  /**
   * Logs Genesys integration activity in local/dev environments.
   * @param {'event'|'command'} kind
   * @param {string} name
   * @param {Object} [details]
   * @private
   */
  static _log(kind, name, details = {}) {
    if (!GenesysService._isLoggingEnabled()) return;

    // eslint-disable-next-line no-console
    console.info('[VirtualAgent][Genesys]', {
      at: new Date().toISOString(),
      kind,
      name,
      ...details,
    });
  }

  /**
   * Logging is on by default for localhost and can be forced via localStorage.
   * localStorage key: "vaVirtualAgentGenesysDebug" = "true"
   * @returns {boolean}
   * @private
   */
  static _isLoggingEnabled() {
    if (typeof window === 'undefined') return false;

    const host = (window.location && window.location.hostname) || '';
    const isLocalhost = host === 'localhost' || host === '127.0.0.1';
    const forcedOn =
      window.localStorage &&
      window.localStorage.getItem('vaVirtualAgentGenesysDebug') === 'true';

    return isLocalhost || forcedOn;
  }

  /**
   * Initialises the service by waiting for MessagingService.ready, then
   * subscribing to all relevant Genesys events.
   *
   * @param {GenesysServiceCallbacks} callbacks
   * @returns {Promise<void>} Resolves when the service is ready.
   */
  init(callbacks) {
    this._callbacks = callbacks;

    return new Promise((resolve, reject) => {
      if (typeof window.Genesys !== 'function') {
        reject(new Error('window.Genesys is not available'));
        return;
      }

      // Subscribe to top-level errors before anything else
      window.Genesys('subscribe', 'MessagingService.error', event => {
        GenesysService._log('event', 'MessagingService.error', {
          payload: event,
        });
        const message =
          (event && event.message) || 'An unknown Genesys error occurred';
        if (this._callbacks && this._callbacks.onError) {
          this._callbacks.onError(message);
        }
      });

      // Everything else happens after the SDK signals it is ready
      window.Genesys('subscribe', 'MessagingService.ready', event => {
        GenesysService._log('event', 'MessagingService.ready', {
          payload: event,
        });
        if (this._callbacks && this._callbacks.onReady) {
          this._callbacks.onReady(event || {});
        }

        this._subscribeToEvents();
        this._loadDeploymentConfiguration();
        resolve();
      });
    });
  }

  /**
   * Loads Genesys deployment configuration via plugin command.
   * @private
   */
  _loadDeploymentConfiguration() {
    window.Genesys('registerPlugin', 'Plugin', Plugin => {
      if (!Plugin || typeof Plugin.command !== 'function') return;

      Plugin.command('GenesysJS.configuration')
        .then(config => {
          GenesysService._log('command', 'GenesysJS.configuration', {
            status: 'resolved',
            response: config,
          });

          if (this._callbacks && this._callbacks.onConfiguration) {
            this._callbacks.onConfiguration(config);
          }
        })
        .catch(error => {
          GenesysService._log('command', 'GenesysJS.configuration', {
            status: 'rejected',
            error,
          });
        });
    });
  }

  /**
   * Subscribes to all messaging events after the SDK is ready.
   * @private
   */
  _subscribeToEvents() {
    window.Genesys('subscribe', 'MessagingService.started', event => {
      GenesysService._log('event', 'MessagingService.started', {
        payload: event,
      });
      if (this._callbacks && this._callbacks.onStarted) {
        this._callbacks.onStarted(event);
      }
    });

    window.Genesys('subscribe', 'MessagingService.messagesReceived', event => {
      GenesysService._log('event', 'MessagingService.messagesReceived', {
        payload: event,
      });
      this._emitNormalizedMessages(event);
    });

    window.Genesys('subscribe', 'MessagingService.restored', event => {
      GenesysService._log('event', 'MessagingService.restored', {
        payload: event,
      });
      const restoredMessages = GenesysService._normalizeMessages(
        GenesysService._extractEventData(event),
      );
      if (this._callbacks && this._callbacks.onRestored) {
        this._callbacks.onRestored(restoredMessages);
      }
      this._emitNormalizedMessages(event);
    });

    window.Genesys('subscribe', 'MessagingService.oldMessages', event => {
      GenesysService._log('event', 'MessagingService.oldMessages', {
        payload: event,
      });
      this._emitNormalizedMessages(event);
    });

    window.Genesys('subscribe', 'MessagingService.sessionCleared', () => {
      GenesysService._log('event', 'MessagingService.sessionCleared');
      if (this._callbacks && this._callbacks.onConnectionStatus) {
        this._callbacks.onConnectionStatus('disconnected');
      }
      if (this._callbacks && this._callbacks.onDisconnected) {
        this._callbacks.onDisconnected();
      }
    });

    window.Genesys(
      'subscribe',
      'MessagingService.conversationDisconnected',
      () => {
        GenesysService._log(
          'event',
          'MessagingService.conversationDisconnected',
        );
        if (this._callbacks && this._callbacks.onConnectionStatus) {
          this._callbacks.onConnectionStatus('disconnected');
        }
        if (this._callbacks && this._callbacks.onDisconnected) {
          this._callbacks.onDisconnected();
        }
      },
    );

    window.Genesys('subscribe', 'MessagingService.offline', () => {
      GenesysService._log('event', 'MessagingService.offline');
      if (this._callbacks && this._callbacks.onConnectionStatus) {
        this._callbacks.onConnectionStatus('offline');
      }
    });

    window.Genesys('subscribe', 'MessagingService.reconnecting', () => {
      GenesysService._log('event', 'MessagingService.reconnecting');
      if (this._callbacks && this._callbacks.onConnectionStatus) {
        this._callbacks.onConnectionStatus('reconnecting');
      }
    });

    window.Genesys('subscribe', 'MessagingService.reconnected', () => {
      GenesysService._log('event', 'MessagingService.reconnected');
      if (this._callbacks && this._callbacks.onConnectionStatus) {
        this._callbacks.onConnectionStatus('connected');
      }
    });

    window.Genesys('subscribe', 'MessagingService.typingReceived', event => {
      const payload = GenesysService._extractEventData(event);
      GenesysService._log('event', 'MessagingService.typingReceived', {
        payload,
      });
      if (this._callbacks && this._callbacks.onTypingIndicator) {
        const typingType =
          payload &&
          payload.typing &&
          typeof payload.typing.type === 'string' &&
          payload.typing.type.toLowerCase();
        const isTyping = typingType === 'on';
        this._callbacks.onTypingIndicator(isTyping);
      }
    });

    window.Genesys('subscribe', 'MessagingService.typingTimeout', () => {
      GenesysService._log('event', 'MessagingService.typingTimeout');
      if (this._callbacks && this._callbacks.onTypingIndicator) {
        this._callbacks.onTypingIndicator(false);
      }
    });
  }

  /**
   * Emits normalized messages to callbacks.
   * @param {Object} event
   * @private
   */
  _emitNormalizedMessages(event) {
    const normalizedMessages = GenesysService._normalizeMessages(
      GenesysService._extractEventData(event),
    );
    if (!normalizedMessages.length || !this._callbacks) return;

    if (this._callbacks.onMessagesReceived) {
      this._callbacks.onMessagesReceived(normalizedMessages);
    }

    if (this._callbacks.onMessageReceived) {
      normalizedMessages.forEach(message => {
        this._callbacks.onMessageReceived(message);
      });
    }
  }

  /**
   * Normalizes a raw Genesys messages payload into ChatMessage records.
   *
   * @param {Object} event
   * @returns {ChatMessage[]}
   * @private
   */
  static _normalizeMessages(event) {
    let rawMessages = [];
    if (Array.isArray(event && event.messages)) {
      rawMessages = event.messages;
    } else if (Array.isArray(event)) {
      rawMessages = event;
    }

    return rawMessages
      .filter(rawMessage => !GenesysService._isPresenceMessage(rawMessage))
      .map(rawMessage => GenesysService._normalizeMessage(rawMessage))
      .filter(Boolean);
  }

  /**
   * The Genesys SDK sends presence messages as events.
   * These are not actual messages and should be ignored in the UI
   * @param {Object} rawMessage
   * @returns boolean
   * @private
   */
  static _isPresenceMessage(rawMessage) {
    const isEvent =
      rawMessage?.type && rawMessage.type.toLowerCase() === 'event';
    const isPresence =
      rawMessage?.events &&
      rawMessage.events.some(event => event.eventType === 'Presence');
    return isEvent && (isPresence || rawMessage?.eventType === 'Presence');
  }

  /**
   * @param {Object} rawMessage
   * @returns {ChatMessage|null}
   * @private
   */
  static _normalizeMessage(rawMessage) {
    if (!rawMessage || typeof rawMessage !== 'object') return null;

    const body =
      rawMessage.text ||
      rawMessage.body ||
      rawMessage.message ||
      (rawMessage.content && rawMessage.content.text) ||
      '';

    if (!body || typeof body !== 'string') return null;

    const isBotMessage =
      rawMessage?.originatingEntity &&
      rawMessage.originatingEntity.toLowerCase() === 'bot';

    const quickReplies = GenesysService._extractQuickReplies(rawMessage);

    return {
      id:
        rawMessage.id ||
        rawMessage.messageId ||
        GenesysService._buildMessageId(),
      sender: isBotMessage ? 'va' : 'user',
      text: body,
      timestamp: GenesysService._normalizeTimestamp(rawMessage),
      quickReplies,
    };
  }

  /**
   * Extract quick reply options from supported payload locations.
   * @param {Object} rawMessage
   * @returns {{ text: string, payload: string }[]}
   * @private
   */
  static _extractQuickReplies(rawMessage) {
    const fromTopLevel = Array.isArray(rawMessage.quickReplies)
      ? rawMessage.quickReplies
      : [];

    const fromContent = Array.isArray(rawMessage.content)
      ? rawMessage.content
          .filter(item => {
            return (
              item &&
              typeof item === 'object' &&
              (item.contentType || '').toLowerCase() === 'quickreply' &&
              item.quickReply
            );
          })
          .map(item => item.quickReply)
      : [];

    const normalizedReplies = [...fromTopLevel, ...fromContent]
      .map(item => ({
        text: (item && item.text) || (item && item.payload) || '',
        payload: (item && item.payload) || (item && item.text) || '',
      }))
      .filter(item => item.text && item.payload);

    const uniqueReplies = [];
    const seen = new Set();

    normalizedReplies.forEach(item => {
      const key = `${item.text}::${item.payload}`;
      if (seen.has(key)) return;
      seen.add(key);
      uniqueReplies.push(item);
    });

    return uniqueReplies;
  }

  /**
   * @param {Object} rawMessage
   * @returns {number}
   * @private
   */
  static _normalizeTimestamp(rawMessage) {
    const timestampValue =
      rawMessage.timestamp ||
      rawMessage.time ||
      (rawMessage.channel && rawMessage.channel.time);

    if (!timestampValue) return Date.now();

    if (typeof timestampValue === 'number') return timestampValue;

    const parsed = new Date(timestampValue).getTime();
    return Number.isNaN(parsed) ? Date.now() : parsed;
  }

  /**
   * Genesys events are often wrapped as { data: ... }.
   * @param {Object} event
   * @returns {Object}
   * @private
   */
  static _extractEventData(event) {
    if (!event || typeof event !== 'object') return {};
    if (event.data && typeof event.data === 'object') return event.data;
    return event;
  }

  /**
   * Builds a unique message id for a Genesys message,
   * used if the message id is not provided by Genesys.
   *
   * @returns {string}
   * @private
   */
  static _buildMessageId() {
    return `msg-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;
  }

  /**
   * @param {string} commandName
   * @param {Object} [payload]
   * @returns {Promise<any>}
   * @private
   */
  _runCommand(commandName, payload = {}) {
    this.constructor._log('command', `MessagingService.${commandName}`, {
      status: 'requested',
      payload,
    });

    return new Promise((resolve, reject) => {
      window.Genesys(
        'command',
        `MessagingService.${commandName}`,
        payload,
        response => {
          this.constructor._log('command', `MessagingService.${commandName}`, {
            status: 'resolved',
            payload,
            response,
          });
          resolve(response);
        },
        error => {
          this.constructor._log('command', `MessagingService.${commandName}`, {
            status: 'rejected',
            payload,
            error,
          });
          reject(error);
        },
      );
    });
  }

  /**
   * Starts a new Genesys conversation session.
   * @returns {Promise<void>}
   */
  startConversation() {
    return this._runCommand('startConversation');
  }

  /**
   * Sends a text message to the active conversation.
   * @param {string} text
   * @returns {Promise<void>}
   */
  sendMessage(text) {
    return this._runCommand('sendMessage', { message: text });
  }

  /**
   * Fetches historical messages for a resumed session.
   * @returns {Promise<void>}
   */
  fetchHistory() {
    return this._runCommand('fetchHistory');
  }

  /**
   * Clears the current session.
   * @returns {Promise<void>}
   */
  clearSession() {
    return this._runCommand('clearSession');
  }

  /**
   * Resets a disconnected read-only conversation.
   * @returns {Promise<void>}
   */
  resetConversation() {
    return this._runCommand('resetConversation');
  }

  /**
   * Permanently clears the active conversation and transcript.
   * @returns {Promise<void>}
   */
  clearConversation() {
    return this._runCommand('clearConversation');
  }

  /**
   * Sends a typing indicator for the local user.
   * @returns {Promise<void>}
   */
  sendTyping() {
    return this._runCommand('sendTyping');
  }

  /**
   * Clears the remote typing timeout.
   * @returns {Promise<void>}
   */
  clearTypingTimeout() {
    return this._runCommand('clearTypingTimeout');
  }

  /**
   * Tears down the service: clears callbacks and resets the singleton so
   * getInstance() will create a fresh instance next time.
   */
  destroy() {
    this._callbacks = null;
    GenesysService._instance = null;
  }
}

export default GenesysService;
