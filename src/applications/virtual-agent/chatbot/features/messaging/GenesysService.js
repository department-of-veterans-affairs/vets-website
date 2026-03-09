/** @typedef {import('../../../types/common.d').ChatMessage} ChatMessage */
/** @typedef {import('../../../types/common.d').GenesysConfig} GenesysConfig */
/** @typedef {import('../../../types/common.d').GenesysServiceCallbacks} GenesysServiceCallbacks */

/**
 * Singleton service that wraps the Genesys Cloud Headless Messenger SDK.
 *
 * This is the ONLY file that touches window.Genesys(). All other layers
 * communicate with Genesys through the callbacks provided to init().
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
        resolve();
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
      const restoredMessages = this._normalizeMessages(
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
    const normalizedMessages = this._normalizeMessages(
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
  _normalizeMessages(event) {
    let rawMessages = [];
    if (Array.isArray(event && event.messages)) {
      rawMessages = event.messages;
    } else if (Array.isArray(event)) {
      rawMessages = event;
    }

    return rawMessages
      .map(rawMessage => this._normalizeMessage(rawMessage))
      .filter(Boolean);
  }

  /**
   * @param {Object} rawMessage
   * @returns {ChatMessage|null}
   * @private
   */
  _normalizeMessage(rawMessage) {
    if (!rawMessage || typeof rawMessage !== 'object') return null;

    const body = rawMessage.text ?? '';

    const direction = (
      rawMessage.direction ||
      rawMessage.messageType ||
      ''
    ).toLowerCase();
    const isUserMessage = direction === 'inbound';

    return {
      id: rawMessage.id ?? GenesysService._buildMessageId(),
      sender: isUserMessage ? 'user' : 'va',
      text: body,
      timestamp: GenesysService._normalizeTimestamp(rawMessage),
    };
  }

  /**
   * @param {Object} rawMessage
   * @returns {number}
   * @private
   */
  static _normalizeTimestamp(rawMessage) {
    const timestampValue =
      rawMessage.time || (rawMessage.channel && rawMessage.channel.time);

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
  static _runCommand(commandName, payload = {}) {
    GenesysService._log('command', `MessagingService.${commandName}`, {
      status: 'requested',
      payload,
    });

    return new Promise((resolve, reject) => {
      window.Genesys(
        'command',
        `MessagingService.${commandName}`,
        payload,
        response => {
          GenesysService._log('command', `MessagingService.${commandName}`, {
            status: 'resolved',
            payload,
            response,
          });
          resolve(response);
        },
        error => {
          GenesysService._log('command', `MessagingService.${commandName}`, {
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
    return GenesysService._runCommand('startConversation');
  }

  /**
   * Sends a text message to the active conversation.
   * @param {string} text
   * @returns {Promise<void>}
   */
  sendMessage(text) {
    return GenesysService._runCommand('sendMessage', { message: text });
  }

  /**
   * Fetches historical messages for a resumed session.
   * @returns {Promise<void>}
   */
  fetchHistory() {
    return GenesysService._runCommand('fetchHistory');
  }

  /**
   * Clears the current session.
   * @returns {Promise<void>}
   */
  clearSession() {
    return GenesysService._runCommand('clearSession');
  }

  /**
   * Resets a disconnected read-only conversation.
   * @returns {Promise<void>}
   */
  resetConversation() {
    return GenesysService._runCommand('resetConversation');
  }

  /**
   * Permanently clears the active conversation and transcript.
   * @returns {Promise<void>}
   */
  clearConversation() {
    return GenesysService._runCommand('clearConversation');
  }

  /**
   * Sends a typing indicator for the local user.
   * @returns {Promise<void>}
   */
  sendTyping() {
    return GenesysService._runCommand('sendTyping');
  }

  /**
   * Clears the remote typing timeout.
   * @returns {Promise<void>}
   */
  clearTypingTimeout() {
    return GenesysService._runCommand('clearTypingTimeout');
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
