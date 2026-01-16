import sinon from 'sinon';
import { expect } from 'chai';

import * as SessionStorageModule from '../../utils/sessionStorage';
import * as LoggingModule from '../../utils/logging';
import signOutEventListener from '../../event-listeners/signOutEventListener';

describe('signOutEventListener', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('setupsignOutEventListener', () => {
    it('should add click event listener to sign out link', () => {
      const link = document.createElement('a');
      link.textContent = 'Sign Out';
      sandbox.stub(document, 'querySelectorAll').returns([link]);
      const addEventListenerStub = sandbox.stub(link, 'addEventListener');

      signOutEventListener();

      expect(addEventListenerStub.calledOnce).to.be.true;
      expect(addEventListenerStub.firstCall.args[0]).to.equal('click');
      expect(addEventListenerStub.firstCall.args[1]).to.be.a('function');
    });

    it('should not add click event listener to sign out link when no sign out link is found', () => {
      const link = document.createElement('a');
      link.textContent = 'Random Link';
      sandbox.stub(document, 'querySelectorAll').returns([link]);
      const addEventListenerStub = sandbox.stub(link, 'addEventListener');

      signOutEventListener();

      expect(addEventListenerStub.notCalled).to.be.true;
    });

    it('should call clearBotSessionStorage when sign out link is clicked', () => {
      const link = document.createElement('a');
      link.textContent = 'Sign Out';
      sandbox.stub(document, 'querySelectorAll').returns([link]);
      const addEventListenerStub = sandbox.stub(link, 'addEventListener');

      const clearBotSessionStorageStub = sandbox.stub(
        SessionStorageModule,
        SessionStorageModule.clearBotSessionStorage.name,
      );

      signOutEventListener();

      const clickHandler = addEventListenerStub.firstCall.args[1];
      clickHandler();

      expect(clearBotSessionStorageStub.calledOnce).to.be.true;
      expect(clearBotSessionStorageStub.firstCall.args[0]).to.be.true;
    });
    it('should not call clearBotSessionStorage when other link is clicked', () => {
      const link = document.createElement('a');
      link.textContent = 'Other';
      sandbox.stub(document, 'querySelectorAll').returns([link]);
      const addEventListenerStub = sandbox.stub(link, 'addEventListener');

      signOutEventListener();
      expect(addEventListenerStub.notCalled).to.be.true;
    });

    it('should log an error when no sign out link is found and user is logged in', () => {
      sandbox.stub(document, 'querySelectorAll').returns([]);
      const logErrorStub = sandbox.stub(LoggingModule, 'logErrorToDatadog');

      signOutEventListener(true);

      expect(logErrorStub.calledOnce).to.be.true;
      const errorArg = logErrorStub.firstCall.args[1];
      expect(errorArg).to.be.instanceOf(TypeError);
    });

    it('should remove the click handler when cleanup is called', () => {
      const link = document.createElement('a');
      link.textContent = 'Sign Out';
      sandbox.stub(document, 'querySelectorAll').returns([link]);
      const addEventListenerStub = sandbox.stub(link, 'addEventListener');
      const removeEventListenerStub = sandbox.stub(link, 'removeEventListener');

      const cleanup = signOutEventListener(false);
      const handler = addEventListenerStub.firstCall.args[1];

      cleanup();

      expect(removeEventListenerStub.calledOnce).to.be.true;
      expect(removeEventListenerStub.firstCall.args[0]).to.equal('click');
      expect(removeEventListenerStub.firstCall.args[1]).to.equal(handler);
    });

    it('should skip removing listeners for non sign-out links during cleanup', () => {
      const signOutLink = document.createElement('a');
      signOutLink.textContent = 'Sign Out';
      const otherLink = document.createElement('a');
      otherLink.textContent = 'Other';
      sandbox
        .stub(document, 'querySelectorAll')
        .returns([signOutLink, otherLink]);
      const addEventListenerStub = sandbox.stub(
        signOutLink,
        'addEventListener',
      );
      const signOutRemoveStub = sandbox.stub(
        signOutLink,
        'removeEventListener',
      );
      const otherRemoveStub = sandbox.stub(otherLink, 'removeEventListener');

      const cleanup = signOutEventListener(false);
      const handler = addEventListenerStub.firstCall.args[1];

      cleanup();

      expect(signOutRemoveStub.calledOnce).to.be.true;
      expect(signOutRemoveStub.firstCall.args[0]).to.equal('click');
      expect(signOutRemoveStub.firstCall.args[1]).to.equal(handler);
      expect(otherRemoveStub.called).to.be.false;
    });
  });
});
