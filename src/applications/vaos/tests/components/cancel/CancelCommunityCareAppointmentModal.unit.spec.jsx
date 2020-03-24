import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import CancelCommunityCareAppointmentModal from '../../../components/cancel/CancelCommunityCareAppointmentModal';

describe('VAOS <CancelCommunityCareAppointmentModal>', () => {
  it('should render', () => {
    const appointment = {
      providerPhone: '1234567890',
      providerPractice: 'Practice name',
    };
    const tree = mount(
      <CancelCommunityCareAppointmentModal appointment={appointment} />,
    );

    expect(tree.find('Modal').props().status).to.equal('warning');
    expect(tree.text()).to.contain(
      'Community Care appointments can’t be canceled',
    );
    expect(tree.text()).to.contain('Practice name');
    expect(tree.find('dl').text()).to.contain('1234567890');

    tree.unmount();
  });

  it('should close modal', () => {
    const appointment = {
      providerPhone: '1234567890',
    };
    const onClose = sinon.spy();
    const tree = mount(
      <CancelCommunityCareAppointmentModal
        appointment={appointment}
        onClose={onClose}
      />,
    );

    tree
      .find('button')
      .at(1)
      .props()
      .onClick();

    expect(onClose.called).to.be.true;

    tree.unmount();
  });
});
