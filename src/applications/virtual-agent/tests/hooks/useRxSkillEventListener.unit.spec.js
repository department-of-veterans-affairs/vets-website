import sinon from 'sinon';
import { expect } from 'chai';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';

import useRxSkillEventListener from '../../hooks/useRxSkillEventListener';
import * as SessionStorageModule from '../../utils/sessionStorage';

describe('rsSkillEventListener', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('useRxSkillEventListener', () => {
    it('should setup event listener', async () => {
      const addEventListenerStub = sandbox.stub(window, 'addEventListener');

      sandbox.stub(SessionStorageModule, 'getIsRxSkill').returns('true');

      renderHook(() => useRxSkillEventListener(sandbox.stub()));
      await act(async () => {
        window.dispatchEvent(new Event('rxSkill'));
      });

      expect(addEventListenerStub.calledWith('rxSkill')).to.be.true;
    });
    it('should call passed in function when event triggers', async () => {
      const setIsRxSkillStateFn = sandbox.stub();

      sandbox.stub(SessionStorageModule, 'getIsRxSkill').returns('true');

      renderHook(() => useRxSkillEventListener(setIsRxSkillStateFn));
      await act(async () => {
        window.dispatchEvent(new Event('rxSkill'));
      });

      expect(setIsRxSkillStateFn.calledOnce).to.be.true;
    });
  });
});
