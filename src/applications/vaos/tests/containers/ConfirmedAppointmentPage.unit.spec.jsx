import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { ConfirmedAppointmentPage } from '../../containers/ConfirmedAppointmentPage';

const appointment = {
  type: 'Primary Care',
  facility: {
    name: 'John Hopkins Medical Center',
  },
  dateTime: '2019-08-29T12:00:00Z',
  preferredContactTime: ['Morning'],
  contactNumber: '555 555-5555',
};

describe('VAOS <ConfirmedAppointmentPage>', () => {
  it('should render a loading indicator', () => {
    const fetchConfirmedAppointments = sinon.spy();
    const tree = shallow(
      <ConfirmedAppointmentPage
        fetchConfirmedAppointments={fetchConfirmedAppointments}
        status="loading"
      />,
    );

    expect(tree.find('LoadingIndicator').exists()).to.be.true;
    expect(fetchConfirmedAppointments.called).to.be.true;
    tree.unmount();
  });

  it('should render confirmed appointment', () => {
    const fetchConfirmedAppointments = sinon.spy();
    const tree = shallow(
      <ConfirmedAppointmentPage
        fetchConfirmedAppointments={fetchConfirmedAppointments}
        appointment={appointment}
        status="succeeded"
      />,
    );

    expect(fetchConfirmedAppointments.called).to.be.true;
    expect(tree.find('LoadingIndicator').exists()).to.be.false;
    expect(tree.text()).to.contain(appointment.type);
    expect(tree.text()).to.contain('555 555-5555, in the morning');
    tree.unmount();
  });

  it('should render contact info morning and afternoon text', () => {
    appointment.preferredContactTime = ['Morning', 'Afternoon'];
    const fetchConfirmedAppointments = sinon.spy();
    const tree = shallow(
      <ConfirmedAppointmentPage
        fetchConfirmedAppointments={fetchConfirmedAppointments}
        appointment={appointment}
        status="succeeded"
      />,
    );

    expect(tree.text()).to.contain('555 555-5555, in the morning or afternoon');
    tree.unmount();
  });

  it('should render contact info morning, afternoon, and evening text', () => {
    appointment.preferredContactTime = ['Morning', 'Afternoon', 'Evening'];
    const fetchConfirmedAppointments = sinon.spy();
    const tree = shallow(
      <ConfirmedAppointmentPage
        fetchConfirmedAppointments={fetchConfirmedAppointments}
        appointment={appointment}
        status="succeeded"
      />,
    );

    expect(tree.text()).to.contain(
      '555 555-5555, in the morning, afternoon, or evening',
    );
    tree.unmount();
  });
});
