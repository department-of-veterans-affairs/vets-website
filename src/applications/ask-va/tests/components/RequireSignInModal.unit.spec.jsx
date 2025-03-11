/* eslint-disable no-console */
import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import RequireSignInModal from '../../components/RequireSignInModal';
import manifest from '../../manifest.json';

// Helper function to get text content from React elements array
const getTextContent = elements => {
  if (!Array.isArray(elements)) return elements;
  return elements
    .map(element => {
      if (typeof element === 'string') return element;
      if (element?.props?.children)
        return getTextContent(element.props.children);
      return '';
    })
    .join('');
};

describe('RequireSignInModal Component', () => {
  let wrapper;
  let sandbox;
  let originalLocation;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };
  });

  afterEach(() => {
    sandbox.restore();
    window.location = originalLocation;
  });

  it('should not render when show is false', () => {
    wrapper = mount(
      <RequireSignInModal
        show={false}
        onClose={() => {}}
        restrictedItem="topic"
      />,
    );
    expect(wrapper.find('VaModal').exists()).to.be.false;
    wrapper.unmount();
  });

  it('should render with default message for topic', () => {
    wrapper = mount(
      <RequireSignInModal show onClose={() => {}} restrictedItem="topic" />,
    );

    const modalContent = wrapper.find('VaModal').prop('children');
    const textContent = getTextContent(modalContent.props.children);
    expect(textContent).to.contain('Because your question is about this topic');
    expect(textContent).to.contain('you need to sign in');
    expect(textContent).to.contain('securely');
    expect(textContent).to.contain('your benefits');
    wrapper.unmount();
  });

  it('should render with default message for category', () => {
    wrapper = mount(
      <RequireSignInModal show onClose={() => {}} restrictedItem="category" />,
    );

    const modalContent = wrapper.find('VaModal').prop('children');
    const textContent = getTextContent(modalContent.props.children);
    expect(textContent).to.contain(
      'Because your question is about this category',
    );
    wrapper.unmount();
  });

  it('should render with default message for question', () => {
    wrapper = mount(
      <RequireSignInModal show onClose={() => {}} restrictedItem="question" />,
    );

    const modalContent = wrapper.find('VaModal').prop('children');
    const textContent = getTextContent(modalContent.props.children);
    console.log('Modal text content:', textContent);
    expect(textContent).to.contain(
      'Because your question is about yourself or someone else',
    );
    wrapper.unmount();
  });

  it('should render with custom message when provided', () => {
    const customMessage = 'This is a custom message';
    wrapper = mount(
      <RequireSignInModal
        show
        onClose={() => {}}
        restrictedItem="topic"
        message={customMessage}
      />,
    );

    const modalContent = wrapper.find('VaModal').prop('children');
    const textContent = getTextContent(modalContent.props.children);
    expect(textContent).to.equal(customMessage);
    wrapper.unmount();
  });

  it('should call onClose when close button is clicked', () => {
    const onCloseSpy = sinon.spy();
    wrapper = mount(
      <RequireSignInModal show onClose={onCloseSpy} restrictedItem="topic" />,
    );

    wrapper
      .find('VaModal')
      .props()
      .onCloseEvent();
    console.log('onClose called:', onCloseSpy.calledOnce);
    expect(onCloseSpy.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('should call onClose and navigate when sign in button is clicked', () => {
    const onCloseSpy = sinon.spy();
    wrapper = mount(
      <RequireSignInModal show onClose={onCloseSpy} restrictedItem="topic" />,
    );

    wrapper
      .find('VaModal')
      .props()
      .onPrimaryButtonClick();

    expect(onCloseSpy.calledOnce).to.be.true;
    expect(window.location.href).to.equal(
      `${manifest.rootUrl}/introduction?showSignInModal=true`,
    );
    wrapper.unmount();
  });

  it('should call onClose when secondary button is clicked', () => {
    const onCloseSpy = sinon.spy();
    wrapper = mount(
      <RequireSignInModal show onClose={onCloseSpy} restrictedItem="topic" />,
    );

    const modal = wrapper.find('VaModal');
    expect(modal.prop('secondaryButtonText')).to.equal('Go back to topic');
    modal.props().onSecondaryButtonClick();
    expect(onCloseSpy.calledOnce).to.be.true;
    wrapper.unmount();
  });
});
