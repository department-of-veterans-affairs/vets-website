import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import CancelCernerAppointmentModal from '../../../components/cancel/CancelCernerAppointmentModal';

describe('VAOS <CancelCernerAppointmentModal>', () => {
  it('should render', () => {
    const tree = mount(<CancelCernerAppointmentModal />);

    expect(tree.find('Modal').props().status).to.equal('warning');
    expect(tree.text()).to.contain(
      'To cancel this appointment, please go to My VA Health.',
    );

    tree.unmount();
  });

  it('should close modal', () => {
    const onClose = sinon.spy();
    const tree = mount(<CancelCernerAppointmentModal onClose={onClose} />);

    // Click the close button
    tree
      .find('button')
      .at(2)
      .props()
      .onClick();

    expect(onClose.called).to.be.true;

    tree.unmount();
  });
});
