import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { useTrackAction } from '../../hooks/useTrackAction';
import * as MrApi from '../../api/MrApi';

describe('useTrackAction hook', () => {
  let postSpy;

  const TestComponent = ({ action }) => {
    useTrackAction(action);
    return null;
  };

  beforeEach(() => {
    postSpy = sinon.spy(MrApi, 'postRecordDatadogAction');
  });

  afterEach(() => {
    postSpy.restore();
  });

  it('calls postRecordDatadogAction on mount with the initial action', () => {
    render(<TestComponent action="INITIAL_ACTION" />);

    // plain Sinon assertions:
    expect(postSpy.calledOnce).to.be.true;
    expect(postSpy.calledWithExactly('INITIAL_ACTION')).to.be.true;
  });

  it('calls postRecordDatadogAction again when the action prop changes', () => {
    const { rerender } = render(<TestComponent action="FIRST" />);
    expect(postSpy.calledOnce).to.be.true;
    expect(postSpy.calledWithExactly('FIRST')).to.be.true;

    rerender(<TestComponent action="SECOND" />);
    // now it should have been called twice total
    expect(postSpy.callCount).to.equal(2);
    // and the second call should be with the new argument
    expect(postSpy.getCall(1).args).to.deep.equal(['SECOND']);
  });
});
