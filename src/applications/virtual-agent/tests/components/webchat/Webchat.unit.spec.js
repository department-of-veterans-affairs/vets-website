import { expect } from 'chai';
import sinon from 'sinon';
import { setMicrophoneMessage } from '../../../components/webchat/WebChat';

describe('WebChat.jsx', () => {
  describe('setMicrophoneMessage', () => {
    it('should set attributes if isRXSkill is true', done => {
      const isRXSkill = 'true';
      const setAttributeSpy = sinon.spy();
      const theDocumentObject = {
        querySelector: sinon.stub().returns({
          setAttribute: setAttributeSpy,
        }),
      };
      const message = 'Type or enable the microphone to speak';

      setMicrophoneMessage(isRXSkill, theDocumentObject)();

      setTimeout(() => {
        expect(setAttributeSpy.getCall(0).args[0]).to.equal('aria-label');
        expect(setAttributeSpy.getCall(0).args[1]).to.equal(message);
        expect(setAttributeSpy.getCall(1).args[0]).to.equal('placeholder');
        expect(setAttributeSpy.getCall(1).args[1]).to.equal(message);
        done();
      }, 0);
    });

    it('should not set attributes if isRXSkill is false', done => {
      const isRXSkill = 'false';
      const setAttributeSpy = sinon.spy();
      const theDocumentObject = {
        querySelector: sinon.stub().returns({
          setAttribute: setAttributeSpy,
        }),
      };

      setMicrophoneMessage(isRXSkill, theDocumentObject)();

      setTimeout(() => {
        expect(setAttributeSpy.called).to.be.false;
        done();
      }, 0);
    });
  });
});
