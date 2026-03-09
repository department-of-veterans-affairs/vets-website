import { expect } from 'chai';
import sinon from 'sinon';

import { GenesysService } from '../../../chatbot/features/messaging/GenesysService';

function buildGenesysStub() {
  const subscriptions = {};
  const commandCallbacks = {};

  const stub = sinon
    .stub()
    .callsFake((action, event, data, successCb, errorCb) => {
      if (action === 'subscribe') {
        subscriptions[event] = data;
      }

      if (action === 'command') {
        commandCallbacks[event] = { successCb, errorCb, data };
        if (successCb) successCb();
      }
    });

  return { stub, subscriptions, commandCallbacks };
}

describe('GenesysService', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    GenesysService.resetInstance();
  });

  afterEach(() => {
    GenesysService.resetInstance();
    sandbox.restore();
    delete window.Genesys;
  });

  describe('getInstance', () => {
    it('returns a GenesysService instance', () => {
      const config = { deploymentId: 'test-id', region: 'test-region' };
      const instance = GenesysService.getInstance(config);
      expect(instance).to.be.instanceOf(GenesysService);
    });

    it('returns the same instance on subsequent calls (singleton)', () => {
      const config = { deploymentId: 'test-id', region: 'test-region' };
      const a = GenesysService.getInstance(config);
      const b = GenesysService.getInstance(config);
      expect(a).to.equal(b);
    });
  });

  describe('resetInstance', () => {
    it('clears the singleton so getInstance creates a fresh instance', () => {
      const config = { deploymentId: 'test-id', region: 'test-region' };
      const first = GenesysService.getInstance(config);
      GenesysService.resetInstance();
      const second = GenesysService.getInstance(config);
      expect(first).to.not.equal(second);
    });
  });

  describe('init', () => {
    it('rejects when window.Genesys is not available', () => {
      const config = { deploymentId: 'id', region: 'region' };
      const service = GenesysService.getInstance(config);
      delete window.Genesys;

      return service.init({}).then(
        () => {
          throw new Error('Should have rejected');
        },
        err => {
          expect(err.message).to.equal('window.Genesys is not available');
        },
      );
    });

    it('subscribes to MessagingService.error and ready', () => {
      const { stub, subscriptions } = buildGenesysStub();
      window.Genesys = stub;

      const config = { deploymentId: 'id', region: 'region' };
      const service = GenesysService.getInstance(config);
      const initPromise = service.init({});

      expect(stub.calledWith('subscribe', 'MessagingService.error')).to.be.true;
      expect(stub.calledWith('subscribe', 'MessagingService.ready')).to.be.true;

      subscriptions['MessagingService.ready']();
      return initPromise;
    });

    it('calls callbacks.onReady when MessagingService.ready fires', () => {
      const { stub, subscriptions } = buildGenesysStub();
      window.Genesys = stub;

      const onReady = sandbox.stub();
      const config = { deploymentId: 'id', region: 'region' };
      const service = GenesysService.getInstance(config);
      const initPromise = service.init({ onReady });

      const readyEvent = { foo: 'bar' };
      subscriptions['MessagingService.ready'](readyEvent);

      return initPromise.then(() => {
        expect(onReady.calledOnce).to.be.true;
        expect(onReady.firstCall.args[0]).to.deep.equal(readyEvent);
      });
    });

    it('subscribes to message, typing, session, and lifecycle events after ready', () => {
      const { stub, subscriptions } = buildGenesysStub();
      window.Genesys = stub;

      const config = { deploymentId: 'id', region: 'region' };
      const service = GenesysService.getInstance(config);
      const initPromise = service.init({});

      subscriptions['MessagingService.ready']();

      return initPromise.then(() => {
        expect(
          stub.calledWith('subscribe', 'MessagingService.messagesReceived'),
        ).to.be.true;
        expect(stub.calledWith('subscribe', 'MessagingService.restored')).to.be
          .true;
        expect(stub.calledWith('subscribe', 'MessagingService.oldMessages')).to
          .be.true;
        expect(stub.calledWith('subscribe', 'MessagingService.typingReceived'))
          .to.be.true;
        expect(stub.calledWith('subscribe', 'MessagingService.typingTimeout'))
          .to.be.true;
        expect(stub.calledWith('subscribe', 'MessagingService.offline')).to.be
          .true;
        expect(stub.calledWith('subscribe', 'MessagingService.reconnecting')).to
          .be.true;
        expect(stub.calledWith('subscribe', 'MessagingService.reconnected')).to
          .be.true;
      });
    });

    it('calls callbacks.onStarted when MessagingService.started fires', () => {
      const { stub, subscriptions } = buildGenesysStub();
      window.Genesys = stub;

      const onStarted = sandbox.stub();
      const config = { deploymentId: 'id', region: 'region' };
      const service = GenesysService.getInstance(config);
      const initPromise = service.init({ onStarted });

      subscriptions['MessagingService.ready']();

      return initPromise.then(() => {
        const payload = { authenticated: true, newSession: true };
        subscriptions['MessagingService.started'](payload);
        expect(onStarted.calledOnce).to.be.true;
        expect(onStarted.firstCall.args[0]).to.deep.equal(payload);
      });
    });

    it('normalizes messages from MessagingService.messagesReceived', () => {
      const { stub, subscriptions } = buildGenesysStub();
      window.Genesys = stub;

      const onMessagesReceived = sandbox.stub();
      const config = { deploymentId: 'id', region: 'region' };
      const service = GenesysService.getInstance(config);
      const initPromise = service.init({ onMessagesReceived });

      subscriptions['MessagingService.ready']();

      return initPromise.then(() => {
        subscriptions['MessagingService.messagesReceived']({
          messages: [
            {
              id: 'event-123',
              text: 'Hello from the bot',
              direction: 'Inbound',
              timestamp: '2024-01-01T00:00:00.000Z',
            },
          ],
        });

        expect(onMessagesReceived.calledOnce).to.be.true;
        const [msg] = onMessagesReceived.firstCall.args[0];
        expect(msg.id).to.equal('event-123');
        expect(msg.text).to.equal('Hello from the bot');
        expect(msg.sender).to.equal('va');
      });
    });

    it('reads restored messages from event.data.messages envelope', () => {
      const { stub, subscriptions } = buildGenesysStub();
      window.Genesys = stub;

      const onMessagesReceived = sandbox.stub();
      const config = { deploymentId: 'id', region: 'region' };
      const service = GenesysService.getInstance(config);
      const initPromise = service.init({ onMessagesReceived });

      subscriptions['MessagingService.ready']();

      return initPromise.then(() => {
        subscriptions['MessagingService.restored']({
          data: {
            messages: [
              {
                id: 'restored-bot-msg',
                text: 'Welcome back',
                messageType: 'outbound',
                timestamp: '2026-03-07T18:03:03.095Z',
              },
              {
                id: 'restored-user-msg',
                text: 'hello',
                messageType: 'inbound',
                timestamp: '2026-03-07T18:02:58.832Z',
              },
            ],
          },
        });

        expect(onMessagesReceived.calledOnce).to.be.true;
        const [messages] = onMessagesReceived.firstCall.args;
        expect(messages).to.have.lengthOf(2);
        expect(messages[0].id).to.equal('restored-bot-msg');
        expect(messages[0].sender).to.equal('va');
        expect(messages[1].id).to.equal('restored-user-msg');
        expect(messages[1].sender).to.equal('user');
      });
    });

    it('calls callbacks.onRestored with normalized restored messages', () => {
      const { stub, subscriptions } = buildGenesysStub();
      window.Genesys = stub;

      const onRestored = sandbox.stub();
      const config = { deploymentId: 'id', region: 'region' };
      const service = GenesysService.getInstance(config);
      const initPromise = service.init({ onRestored });

      subscriptions['MessagingService.ready']();

      return initPromise.then(() => {
        subscriptions['MessagingService.restored']({
          data: {
            messages: [
              {
                id: 'restored-user-msg',
                text: 'hello',
                messageType: 'inbound',
                timestamp: '2026-03-07T18:02:58.832Z',
              },
            ],
          },
        });

        expect(onRestored.calledOnce).to.be.true;
        const [messages] = onRestored.firstCall.args;
        expect(messages).to.have.lengthOf(1);
        expect(messages[0].sender).to.equal('user');
      });
    });

    it('marks outbound echoed messages with sender user', () => {
      const { stub, subscriptions } = buildGenesysStub();
      window.Genesys = stub;

      const onMessagesReceived = sandbox.stub();
      const config = { deploymentId: 'id', region: 'region' };
      const service = GenesysService.getInstance(config);
      const initPromise = service.init({ onMessagesReceived });

      subscriptions['MessagingService.ready']();

      return initPromise.then(() => {
        subscriptions['MessagingService.messagesReceived']({
          messages: [
            { id: 'echo-1', body: 'User said this', direction: 'Outbound' },
          ],
        });

        const [msg] = onMessagesReceived.firstCall.args[0];
        expect(msg.sender).to.equal('user');
      });
    });

    it('calls callbacks.onError when MessagingService.error fires', () => {
      const { stub, subscriptions } = buildGenesysStub();
      window.Genesys = stub;

      const onError = sandbox.stub();
      const config = { deploymentId: 'id', region: 'region' };
      const service = GenesysService.getInstance(config);
      const initPromise = service.init({ onError });

      subscriptions['MessagingService.ready']();

      return initPromise.then(() => {
        subscriptions['MessagingService.error']({ message: 'Boom' });
        expect(onError.calledOnce).to.be.true;
        expect(onError.firstCall.args[0]).to.equal('Boom');
      });
    });

    it('maps typing events to true/false values', () => {
      const { stub, subscriptions } = buildGenesysStub();
      window.Genesys = stub;

      const onTypingIndicator = sandbox.stub();
      const config = { deploymentId: 'id', region: 'region' };
      const service = GenesysService.getInstance(config);
      const initPromise = service.init({ onTypingIndicator });

      subscriptions['MessagingService.ready']();

      return initPromise.then(() => {
        subscriptions['MessagingService.typingReceived']({
          typing: { type: 'On', durationMs: 5000 },
        });
        subscriptions['MessagingService.typingTimeout']();

        expect(onTypingIndicator.firstCall.args[0]).to.equal(true);
        expect(onTypingIndicator.secondCall.args[0]).to.equal(false);
      });
    });

    it('maps connection lifecycle events to connection statuses', () => {
      const { stub, subscriptions } = buildGenesysStub();
      window.Genesys = stub;

      const onConnectionStatus = sandbox.stub();
      const config = { deploymentId: 'id', region: 'region' };
      const service = GenesysService.getInstance(config);
      const initPromise = service.init({ onConnectionStatus });

      subscriptions['MessagingService.ready']();

      return initPromise.then(() => {
        subscriptions['MessagingService.offline']();
        subscriptions['MessagingService.reconnecting']();
        subscriptions['MessagingService.reconnected']();

        expect(onConnectionStatus.getCall(0).args[0]).to.equal('offline');
        expect(onConnectionStatus.getCall(1).args[0]).to.equal('reconnecting');
        expect(onConnectionStatus.getCall(2).args[0]).to.equal('connected');
      });
    });

    it('calls callbacks.onDisconnected when session is cleared', () => {
      const { stub, subscriptions } = buildGenesysStub();
      window.Genesys = stub;

      const onDisconnected = sandbox.stub();
      const config = { deploymentId: 'id', region: 'region' };
      const service = GenesysService.getInstance(config);
      const initPromise = service.init({ onDisconnected });

      subscriptions['MessagingService.ready']();

      return initPromise.then(() => {
        subscriptions['MessagingService.sessionCleared']();
        expect(onDisconnected.calledOnce).to.be.true;
      });
    });
  });

  describe('commands', () => {
    it('calls startConversation command', () => {
      const { stub } = buildGenesysStub();
      window.Genesys = stub;

      const config = { deploymentId: 'id', region: 'region' };
      const service = GenesysService.getInstance(config);

      return service.startConversation().then(() => {
        expect(
          stub.calledWith('command', 'MessagingService.startConversation', {}),
        ).to.be.true;
      });
    });

    it('calls sendMessage with the correct payload', () => {
      const { stub, commandCallbacks } = buildGenesysStub();
      window.Genesys = stub;

      const config = { deploymentId: 'id', region: 'region' };
      const service = GenesysService.getInstance(config);

      return service.sendMessage('Hello!').then(() => {
        expect(stub.calledWith('command', 'MessagingService.sendMessage')).to.be
          .true;
        expect(
          commandCallbacks['MessagingService.sendMessage'].data,
        ).to.deep.equal({ message: 'Hello!' });
      });
    });

    it('calls clearSession command', () => {
      const { stub } = buildGenesysStub();
      window.Genesys = stub;

      const config = { deploymentId: 'id', region: 'region' };
      const service = GenesysService.getInstance(config);

      return service.clearSession().then(() => {
        expect(stub.calledWith('command', 'MessagingService.clearSession')).to
          .be.true;
      });
    });
  });

  describe('destroy', () => {
    it('clears callbacks and resets the singleton', () => {
      const config = { deploymentId: 'id', region: 'region' };
      const service = GenesysService.getInstance(config);
      service.destroy();

      const fresh = GenesysService.getInstance(config);
      expect(fresh).to.not.equal(service);
    });
  });
});
