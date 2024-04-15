import { expect } from 'chai';
import sinon from 'sinon';
import { scrollToElement } from '../../helpers';

describe('scrollToElement', () => {
  let sandbox;
  let scrollIntoViewSpy;

  beforeEach(() => {
    // Create a Sinon sandbox
    sandbox = sinon.createSandbox();

    // Stub document.getElementById and setup a spy for scrollIntoView
    const fakeElement = { scrollIntoView: sandbox.spy() };
    sandbox.stub(global.document, 'getElementById').returns(fakeElement);

    // Reference to the scrollIntoView spy
    scrollIntoViewSpy = fakeElement.scrollIntoView;
  });

  afterEach(() => {
    // Restore all the Sinon objects in the sandbox
    sandbox.restore();
  });

  it('scrolls to the element if it exists', () => {
    scrollToElement('testElement');

    expect(global.document.getElementById.calledWith('testElement')).to.be.true;
    expect(scrollIntoViewSpy.calledOnce).to.be.true;
    expect(scrollIntoViewSpy.calledWith({ behavior: 'smooth' })).to.be.true;
  });

  it('does nothing if the element does not exist', () => {
    global.document.getElementById.returns(null);

    scrollToElement('nonExistentElement');

    expect(scrollIntoViewSpy.notCalled).to.be.true;
  });
});
