import React from 'react';
import { expect } from 'chai';

import { isReactComponent } from '../../ui';

describe('isReactComponent', () => {
  it('should return true for function component', () => {
    expect(isReactComponent(() => <div />)).to.be.true;
  });
  it('should return true for class component', () => {
    class MyComponent extends React.Component {
      constructor() {
        super();
        this.state = { test: true };
      }
      render() {
        return <div />;
      }
    }
    expect(isReactComponent(MyComponent)).to.be.true;
  });
  it('should return true for memoized component', () => {
    expect(isReactComponent(React.memo(() => <div />))).to.be.true;
  });
  it('should return false for regular element', () => {
    expect(isReactComponent(<div />)).to.be.false;
  });
  it('should return false for fragment', () => {
    expect(isReactComponent(<>Test</>)).to.be.false;
  });
  it('should return false for string', () => {
    expect(isReactComponent('Test')).to.be.false;
  });
  it('should return false for number', () => {
    expect(isReactComponent(3)).to.be.false;
  });
  it('should return false for null', () => {
    expect(isReactComponent(null)).to.be.false;
  });
  it('should return false for undefined', () => {
    expect(isReactComponent()).to.be.false;
  });
});
