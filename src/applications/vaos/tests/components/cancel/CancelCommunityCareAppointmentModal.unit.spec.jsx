import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import CancelCommunityCareAppointmentModal from '../../../components/cancel/CancelCommunityCareAppointmentModal';

describe('VAOS <CancelCommunityCareAppointmentModal>', () => {
  it('should render', () => {
    const appointment = {
      resourceType: 'Appointment',
      status: 'booked',
      description: null,
      start: '2019-05-22T10:00:00Z',
      minutesDuration: 60,
      comment: 'Instruction text',
      participant: [
        {
          actor: {
            reference: 'Practitioner/PRACTITIONER_ID',
            display: 'Rick Katz',
          },
        },
      ],
      contained: [
        {
          actor: {
            name: 'Practice name',
            address: {
              line: ['123 second st'],
              city: 'Northampton',
              state: 'MA',
              postalCode: '22222',
            },
            telecom: [
              {
                system: 'phone',
                value: '1234567890',
              },
            ],
          },
        },
      ],
      legacyVAR: {
        id: '8a4885896a22f88f016a2cb7f5de0062',
      },
      vaos: {
        isPastAppointment: false,
        appointmentType: 'ccAppointment',
        isCommunityCare: true,
        timeZone: 'UTC',
      },
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
