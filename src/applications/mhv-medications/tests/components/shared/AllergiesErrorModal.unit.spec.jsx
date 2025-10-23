import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import AllergiesErrorModal from '../../../components/shared/AllergiesErrorModal';

describe('AllergiesErrorModal', () => {
  let wrapper;

  beforeEach(() => {
    const onCloseSpy = sinon.spy();
    const onDownloadSpy = sinon.spy();
    const onCancelSpy = sinon.spy();

    wrapper = mount(
      <AllergiesErrorModal
        visible
        onCloseButtonClick={onCloseSpy}
        onDownloadButtonClick={onDownloadSpy}
        onCancelButtonClick={onCancelSpy}
      />,
    );
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should be visible when `visible` prop is true', () => {
    expect(wrapper.prop('visible')).to.be.true;
  });

  it('should call `onCloseButtonClick` prop when close is clicked', () => {
    const onCloseSpy = wrapper.prop('onCloseButtonClick');
    wrapper
      .find('VaModal')
      .props()
      .onCloseEvent();
    expect(onCloseSpy.calledOnce).to.be.true;
  });

  it('should call `onDownloadButtonClick` prop when download is clicked', () => {
    const onDownloadSpy = wrapper.prop('onDownloadButtonClick');
    wrapper
      .find('VaModal')
      .props()
      .onPrimaryButtonClick();
    expect(onDownloadSpy.calledOnce).to.be.true;
  });

  it('should call `onCancelButtonClick` prop when cancel is clicked', () => {
    const onCancelSpy = wrapper.prop('onCancelButtonClick');
    wrapper
      .find('VaModal')
      .props()
      .onSecondaryButtonClick();
    expect(onCancelSpy.calledOnce).to.be.true;
  });
});
