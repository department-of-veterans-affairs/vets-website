import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { FETCH_STATUS } from '../../../utils/constants';

import CancelAppointmentConfirmationModal from '../../../components/cancel/CancelAppointmentConfirmationModal';

describe('VAOS <CancelAppointmentConfirmationModal>', () => {
  it('should render', () => {
    const tree = mount(
      <CancelAppointmentConfirmationModal status={FETCH_STATUS.notStarted} />,
    );

    expect(tree.find('Modal').props().status).to.equal('warning');
    expect(tree.find('Modal').find('button').length).to.equal(3);
    expect(
      tree
        .find('Modal')
        .find('LoadingButton')
        .prop('children'),
    ).to.equal('Yes, cancel this appointment');
    expect(
      tree
        .find('Modal')
        .find('button')
        .at(2)
        .text(),
    ).to.equal('No, take me back');

    tree.unmount();
  });

  it('should render loading state when cancelling', () => {
    const tree = mount(
      <CancelAppointmentConfirmationModal status={FETCH_STATUS.loading} />,
    );

    expect(tree.find('Modal').find('button').length).to.equal(2);
    expect(
      tree
        .find('Modal')
        .find('LoadingButton')
        .props().isLoading,
    ).to.be.true;
    expect(
      tree
        .find('Modal')
        .find('button')
        .at(1)
        .props().disabled,
    ).to.be.true;

    tree.unmount();
  });

  it('should close modal', () => {
    const onClose = sinon.spy();
    const tree = mount(
      <CancelAppointmentConfirmationModal
        onClose={onClose}
        status={FETCH_STATUS.notStarted}
      />,
    );

    tree
      .find('button')
      .at(2)
      .props()
      .onClick();

    expect(onClose.called).to.be.true;

    tree.unmount();
  });
});
