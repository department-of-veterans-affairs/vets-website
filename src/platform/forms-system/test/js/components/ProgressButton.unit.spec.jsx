import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import chaiAsPromised from 'chai-as-promised';
import chai, { expect } from 'chai';
import sinon from 'sinon';

import { axeCheck } from '../../config/helpers';
import ProgressButton from '../../../src/js/components/ProgressButton.jsx';

chai.use(chaiAsPromised);

describe('<ProgressButton>', () => {
  it('should render with button text', () => {
    const tree = shallow(
      <ProgressButton
        buttonText="Button text"
        buttonClass="usa-button-primary"
        disabled={false}
      />,
    );
    expect(tree.text()).to.equal('Button text');
    expect(tree).to.have.length.of(1);
    tree.unmount();
  });

  it('calls handle() on click', () => {
    let progressButton;

    const updatePromise = new Promise((resolve, _reject) => {
      progressButton = ReactTestUtils.renderIntoDocument(
        <ProgressButton
          buttonText="Button text"
          buttonClass="usa-button-primary"
          disabled={false}
          onButtonClick={() => {
            resolve(true);
          }}
        />,
      );
    });

    const button = ReactTestUtils.findRenderedDOMComponentWithTag(
      progressButton,
      'button',
    );
    ReactTestUtils.Simulate.click(button);

    return expect(updatePromise).to.eventually.eql(true);
  });

  it('calls handle() on click even if mouseDown happens', () => {
    let progressButton;
    const spy = sinon.spy();

    const updatePromise = new Promise((resolve, _reject) => {
      progressButton = ReactTestUtils.renderIntoDocument(
        <ProgressButton
          buttonText="Button text"
          buttonClass="usa-button-primary"
          disabled={false}
          onButtonClick={() => {
            resolve(true);
          }}
          preventOnBlur={spy}
        />,
      );
    });

    const button = ReactTestUtils.findRenderedDOMComponentWithTag(
      progressButton,
      'button',
    );

    ReactTestUtils.Simulate.mouseDown(button);
    ReactTestUtils.Simulate.click(button);

    expect(spy.calledOnce).to.be.true;
    return expect(updatePromise).to.eventually.eql(true);
  });

  it('calls preventDefault() on mouseDown event when providing prop', () => {
    const spy = sinon.spy();

    const progressButton = ReactTestUtils.renderIntoDocument(
      <ProgressButton
        buttonText="Button text"
        buttonClass="usa-button-primary"
        disabled={false}
        preventOnBlur={spy}
      />,
    );

    const button = ReactTestUtils.findRenderedDOMComponentWithTag(
      progressButton,
      'button',
    );

    ReactTestUtils.Simulate.mouseDown(button);

    expect(spy.calledOnce).to.be.true;
  });

  it('calls preventDefault() on mouseDown event with defaultProperty', () => {
    const wrapper = shallow(
      <ProgressButton
        buttonText="Button text"
        buttonClass="usa-button-primary"
        disabled={false}
      />,
    );

    expect(
      wrapper.find('button').simulate('mouseDown', { preventDefault() {} }),
    );
    wrapper.unmount();
  });

  it('should pass aXe check when enabled', () =>
    axeCheck(
      <ProgressButton
        buttonText="Button text"
        buttonClass="usa-button-primary"
        disabled={false}
      />,
    ));

  it('should pass aXe check when disabled', () =>
    axeCheck(
      <ProgressButton
        buttonText="Button text"
        buttonClass="usa-button-primary"
        disabled
      />,
    ));
});
