import { expect } from 'chai';
import * as ReactReduxModule from 'react-redux';
import sinon from 'sinon';

import { renderHook } from '@testing-library/react-hooks';
import * as ActionsModule from '~/platform/site-wide/user-nav/actions';
import useLoginModal from '../../../webchat/hooks/useLoginModal';

describe('useLoginModal', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('useLoginModal', () => {
    it('should call showLoginModal if user is not logged in, it is an auth topic and virtualAgentUseStsAuthentication is enabled', () => {
      const toggleLoginModalSpy = sandbox.spy(
        ActionsModule,
        'toggleLoginModal',
      );
      const useDispatchStub = sandbox
        .stub(ReactReduxModule, 'useDispatch')
        .returns(() => {});

      renderHook(() => useLoginModal(false, true, true));

      expect(toggleLoginModalSpy.calledOnce).to.be.true;
      expect(useDispatchStub.calledOnce).to.be.true;
    });
    it('should not call showLoginModal if user is logged in', () => {
      const toggleLoginModalSpy = sandbox.spy(
        ActionsModule,
        'toggleLoginModal',
      );
      sandbox.stub(ReactReduxModule, 'useDispatch').returns(() => {});

      renderHook(() => useLoginModal(true, true, true));

      expect(toggleLoginModalSpy.notCalled).to.be.true;
    });
    it('should not call showLoginModal if it is not an auth topic', () => {
      const toggleLoginModalSpy = sandbox.spy(
        ActionsModule,
        'toggleLoginModal',
      );
      sandbox.stub(ReactReduxModule, 'useDispatch').returns(() => {});

      renderHook(() => useLoginModal(false, false, true));

      expect(toggleLoginModalSpy.notCalled).to.be.true;
    });
    it('should not call showLoginModal if virtualAgentUseStsAuthentication is disabled', () => {
      const toggleLoginModalSpy = sandbox.spy(
        ActionsModule,
        'toggleLoginModal',
      );
      sandbox.stub(ReactReduxModule, 'useDispatch').returns(() => {});

      renderHook(() => useLoginModal(false, true, false));

      expect(toggleLoginModalSpy.notCalled).to.be.true;
    });
  });
});
