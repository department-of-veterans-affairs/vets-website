import React from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';

import { usePrevious, useStaggeredFeatureRelease } from '../react-hooks';

describe('usePrevious', () => {
  let container;
  let previousValue;

  const TestComponent = ({ aValue }) => {
    previousValue = usePrevious(aValue);
    return null;
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it('should return undefined on first use', () => {
    ReactDOM.render(<TestComponent aValue={0} />, container);
    expect(previousValue).to.be.undefined;
  });

  it('should return the previous value it was given', () => {
    ReactDOM.render(<TestComponent aValue={0} />, container);
    ReactDOM.render(<TestComponent aValue={1} />, container);
    expect(previousValue).to.equal(0);

    ReactDOM.render(<TestComponent aValue={2} />, container);
    expect(previousValue).to.equal(1);
  });
});

describe('useStaggeredFeatureRelease', () => {
  let container;
  let isAllowed;

  const TestComponent = ({ displayThreshold }) => {
    isAllowed = useStaggeredFeatureRelease(displayThreshold, 'test-value');
    return null;
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it('should wrap a call to localStorage.setItem', () => {
    const spy = sinon.spy(global.window.localStorage, 'setItem');
    ReactDOM.render(<TestComponent displayThreshold={100} />, container);
    expect(spy.calledWith('test-value', '100'));
    spy.reset();
  });

  it('should not allow feature with 0 displayThreshold', () => {
    const spy = sinon.spy(global.window.localStorage, 'setItem');
    ReactDOM.render(<TestComponent displayThreshold={0} />, container);
    expect(isAllowed).to.be.false;
    expect(spy.calledWith('test-value', '0'));
    spy.reset();
  });
});
