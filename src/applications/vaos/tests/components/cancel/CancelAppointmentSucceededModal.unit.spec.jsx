import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import CancelAppointmentSucceededModal from '../../../components/cancel/CancelAppointmentSucceededModal';

describe('VAOS <CancelAppointmentSucceededModal>', () => {
  it('should render', () => {
    const tree = mount(<CancelAppointmentSucceededModal />);

    expect(tree.find('Modal').props().status).to.equal('success');
    expect(tree.text()).to.contain(
      'We’ve let your provider know you canceled this appointment',
    );

    tree.unmount();
  });

  it('should close modal', () => {
    const onClose = sinon.spy();
    const tree = mount(<CancelAppointmentSucceededModal onClose={onClose} />);

    tree
      .find('button')
      .at(1)
      .props()
      .onClick();

    expect(onClose.called).to.be.true;

    tree.unmount();
  });
});
