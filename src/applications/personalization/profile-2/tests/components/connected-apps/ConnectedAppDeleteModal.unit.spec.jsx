import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { ConnectedAppDeleteModal } from '../../../components/connected-apps/ConnectedAppDeleteModal';

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

    const text = wrapper.text();
    expect(text).to.include('Do you want to disconnect this app?');
    expect(text).to.include(
      'hello won’t have access to new information about you from VA once you disconnect. This may impact the usefulness of the app.',
    );
    expect(
      wrapper
        .find('button')
        .at(1)
        .text(),
    ).to.include('Cancel');
    expect(
      wrapper
        .find('button')
        .at(2)
        .text(),
    ).to.include('Disconnect');

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

    const text = wrapper.text();
    expect(text).to.include('Do you want to disconnect this app?');
    expect(text).to.include(
      'hello won’t have access to new information about you from VA once you disconnect. This may impact the usefulness of the app.',
    );
    expect(text).to.not.include('Cancel');
    expect(text).to.not.include('Disconnect');
    expect(text).to.include('Processing update...');

    wrapper.unmount();
  });

  it('does not render when modal is closed', () => {
    const defaultProps = {
      title: 'hello',
      deleting: true,
      modalOpen: false,
      onCloseModal: () => {},
      onConfirmDelete: () => {},
    };

    const wrapper = mount(<ConnectedAppDeleteModal {...defaultProps} />);

    const text = wrapper.text();
    expect(text).to.not.include('Do you want to disconnect this app?');
    expect(text).to.not.include(
      'hello won’t have access to new information about you from VA once you disconnect. This may impact the usefulness of the app.',
    );
    expect(text).to.not.include('Cancel');
    expect(text).to.not.include('Disconnect');
    expect(text).to.not.include('Processing update...');

    wrapper.unmount();
  });
});
