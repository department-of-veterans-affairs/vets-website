import { expect } from 'chai';
import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';

import useSetSendBoxMessage from '../../hooks/useSetSendBoxMessage';

describe('useSetSendBoxMessage', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('useSetSendBoxMessage', () => {
    it('should set the send box message for microphone', () => {
      const setAttributeSpy = sandbox.spy();
      sandbox.stub(document, 'querySelector').returns({
        setAttribute: setAttributeSpy,
      });

      renderHook(() => useSetSendBoxMessage('true'));

      expect(setAttributeSpy.calledTwice).to.be.true;
      expect(
        setAttributeSpy.calledWith(
          'aria-label',
          'Type or enable the microphone to speak',
        ),
      ).to.be.true;
      expect(
        setAttributeSpy.calledWith(
          'placeholder',
          'Type or enable the microphone to speak',
        ),
      ).to.be.true;
    });
    it('should set the send box message for non-microphone', () => {
      const setAttributeSpy = sandbox.spy();
      sandbox.stub(document, 'querySelector').returns({
        setAttribute: setAttributeSpy,
      });

      renderHook(() => useSetSendBoxMessage('false'));

      expect(setAttributeSpy.calledTwice).to.be.true;
      expect(setAttributeSpy.calledWith('aria-label', 'Type your message')).to
        .be.true;
      expect(setAttributeSpy.calledWith('placeholder', 'Type your message')).to
        .be.true;
    });
  });
});
