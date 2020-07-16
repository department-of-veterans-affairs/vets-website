import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import CancelVideoAppointmentModal from '../../../components/cancel/CancelVideoAppointmentModal';

describe('VAOS <CancelVideoAppointmentModal>', () => {
  it('should render', () => {
    const appointment = {};
    const facility = {
      name: 'Facility name',
      telecom: [
        {
          system: 'phone',
          value: '234-244-4444',
        },
      ],
    };
    const tree = mount(
      <CancelVideoAppointmentModal
        facility={facility}
        appointment={appointment}
      />,
    );

    expect(tree.find('Modal').props().status).to.equal('warning');
    expect(tree.text()).to.contain(
      'VA Video Connect appointments can’t be canceled',
    );
    expect(tree.text()).to.contain('Facility name');
    expect(tree.find('dl').text()).to.contain('234-244-4444');

    tree.unmount();
  });

  it('should close modal', () => {
    const appointment = {};
    const onClose = sinon.spy();
    const tree = mount(
      <CancelVideoAppointmentModal
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
