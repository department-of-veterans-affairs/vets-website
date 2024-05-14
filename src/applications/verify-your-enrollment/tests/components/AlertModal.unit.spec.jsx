import React from 'react';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import AlertModal from '../../components/AlertModal';

describe('<AlertModal/>', () => {
  const alertProps = {
    showModal: false,
    cancelEditClick: sinon.spy(),
    setShowModal: sinon.spy(),
    formType: 'malling Address',
  };
  it('should render without crashing', () => {
    const wrapper = shallow(<AlertModal {...alertProps} />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
  it('should not be visible if showModal is false', async () => {
    const wrapper = mount(<AlertModal {...alertProps} />);
    await waitFor(() => {
      expect(wrapper.find('va-modal').prop('visible')).to.be.false;
    });

    wrapper.unmount();
  });

  it('should be visible if showModal is true', async () => {
    const wrapper = mount(<AlertModal {...alertProps} showModal />);
    await waitFor(() => {
      expect(wrapper.find('va-modal').prop('visible')).to.be.true;
    });

    wrapper.unmount();
  });
  it('should calls setShowModal with false on secondary button click', async () => {
    const wrapper = mount(<AlertModal {...alertProps} showModal />);
    wrapper.setProps({ showModal: true });
    await waitFor(() => {
      wrapper.find('VaModal').prop('onSecondaryButtonClick')();
      expect(alertProps.setShowModal.calledWith(false)).to.be.true;
      expect(alertProps.setShowModal.calledOnce).to.be.true;
    });

    wrapper.unmount();
  });
  it('should calls setShowModal with false on onCloseEvent button click', async () => {
    const wrapper = mount(<AlertModal {...alertProps} showModal />);
    wrapper.setProps({ showModal: true });
    await waitFor(() => {
      wrapper.find('VaModal').prop('onCloseEvent')();
      expect(alertProps.setShowModal.calledWith(false)).to.be.true;
    });

    wrapper.unmount();
  });
});
