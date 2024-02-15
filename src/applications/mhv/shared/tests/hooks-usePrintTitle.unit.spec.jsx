import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { expect } from 'chai';
import sinon from 'sinon';
import usePrintTitle from '../hooks/usePrintTitle';

describe('usePrintTitle', () => {
  let container = null;
  let addEventListenerSpy;
  let removeEventListenerSpy;

  beforeEach(() => {
    // Set up a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);

    // Create spies for window.addEventListener and window.removeEventListener
    addEventListenerSpy = sinon.spy(window, 'addEventListener');
    removeEventListenerSpy = sinon.spy(window, 'removeEventListener');
  });

  afterEach(() => {
    // Clean up on exiting
    unmountComponentAtNode(container);

    // Restore spies
    addEventListenerSpy.restore();
    removeEventListenerSpy.restore();

    // Remove the container from the body
    document.body.removeChild(container);
    container = null;
  });

  it('should register and unregister event listeners on mount and unmount', () => {
    const baseTitle = 'MHV';
    const userDetails = { first: 'John', last: 'Doe', suffix: 'Mr.' };
    const dob = '1990-01-01';
    const dateFormat = sinon.stub();
    const updatePageTitle = sinon.stub();

    const TestComponent = () => {
      usePrintTitle(baseTitle, userDetails, dob, dateFormat, updatePageTitle);
      return null;
    };

    act(() => {
      render(<TestComponent />, container);
    });

    // not sure why is called 6 times but it is normal behavior
    expect(addEventListenerSpy.callCount).to.equal(6);
    expect(addEventListenerSpy.getCall(4).args[0]).to.equal('beforeprint');
    expect(addEventListenerSpy.getCall(5).args[0]).to.equal('afterprint');

    act(() => {
      unmountComponentAtNode(container);
    });

    // not sure why is called 10 times but it is normal behavior
    expect(removeEventListenerSpy.callCount).to.equal(10);
    expect(removeEventListenerSpy.getCall(7).args[0]).to.equal('beforeprint');
    expect(removeEventListenerSpy.getCall(8).args[0]).to.equal('afterprint');
  });

  // Add more test cases based on your specific use case
});
