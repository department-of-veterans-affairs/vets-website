import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { ConnectedAppDeleteModal } from '../../../components/connected-apps/ConnectedAppDeleteModal';

const disconnectTitle = 'Are you sure?';
const disconnectText =
  'After you disconnect this app, the app won’t have access to new information from your VA.gov profile. This may affect how useful the app is to you.';

describe('<ConnectedAppDeleteModal>', () => {
  it('renders correctly when not deleting', () => {
    const defaultProps = {
      title: 'hello',
      deleting: false,
      modalOpen: true,
      onCloseModal: () => {},
      onConfirmDelete: () => {},
    };

    const wrapper = mount(<ConnectedAppDeleteModal {...defaultProps} />);

    const text = wrapper.html();
    expect(text).to.include(disconnectTitle);
    expect(text).to.include(disconnectText);
    expect(
      wrapper
        .find('va-button')
        .at(0)
        .props(),
    ).to.have.property('text', 'Disconnect');
    expect(
      wrapper
        .find('va-button')
        .at(1)
        .props(),
    ).to.have.property('text', 'No, cancel this change');

    expect(text).to.not.include('Processing update...');

    wrapper.unmount();
  });

  it('renders correctly when deleting', () => {
    const defaultProps = {
      title: 'hello',
      deleting: true,
      modalOpen: true,
      onCloseModal: () => {},
      onConfirmDelete: () => {},
    };

    const wrapper = mount(<ConnectedAppDeleteModal {...defaultProps} />);
    const text = wrapper.html();
    expect(text).to.include(disconnectTitle);
    expect(text).to.include(disconnectText);
    expect(text).to.not.include('No, cancel this change');
    expect(text).to.not.include('Disconnect');
    expect(text).to.include('Processing update...');

    wrapper.unmount();
  });

  it('is not visible when modal is closed', () => {
    const defaultProps = {
      title: 'hello',
      deleting: true,
      modalOpen: false,
      onCloseModal: () => {},
      onConfirmDelete: () => {},
    };

    const wrapper = mount(<ConnectedAppDeleteModal {...defaultProps} />);
    expect(wrapper.html()).to.include('visible="false"');
    wrapper.unmount();
  });
});
