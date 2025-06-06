import sinon from 'sinon';
import { expect } from 'chai';

import * as SessionStorageModule from '../../utils/sessionStorage';
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
  });
});
