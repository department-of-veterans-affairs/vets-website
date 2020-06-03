import React from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';

import { usePrevious } from '../react-hooks';

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
