import sinon from 'sinon';
import { expect } from 'chai';

import { renderHook } from '@testing-library/react-hooks';
import useLoadWebChat from '../../hooks/useLoadWebChat';

describe('useLoadWebChat', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('useLoadWebChat', () => {
    it('should load webchat v4.17.0', () => {
      renderHook(() => useLoadWebChat());

      const script = document.querySelector('script');
      expect(script.src).to.equal(
        'https://cdn.botframework.com/botframework-webchat/4.17.0/webchat.js',
      );
    });
  });
});
