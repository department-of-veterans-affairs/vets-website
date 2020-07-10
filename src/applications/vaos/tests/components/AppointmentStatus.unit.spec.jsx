import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import AppointmentStatus from '../../components/AppointmentStatus';
import { APPOINTMENT_STATUS } from '../../utils/constants';

describe('VAOS <AppointmentStatus>', () => {
  it('should render booked', () => {
    const tree = shallow(
      <AppointmentStatus status={APPOINTMENT_STATUS.booked} />,
    );

    expect(tree.find('i').props().className).to.contain('fa-check-circle');
    expect(tree.text()).to.contain('Confirmed');

    tree.unmount();
  });

  it('should render completed if past appointment', () => {
    const tree = shallow(
      <AppointmentStatus
        status={APPOINTMENT_STATUS.booked}
        isPastAppointment
      />,
    );

    expect(tree.find('i').props().className).to.contain('fa-check-circle');
    expect(tree.text()).to.contain('Completed');

    tree.unmount();
  });

  it('should render pending', () => {
    const tree = shallow(
      <AppointmentStatus status={APPOINTMENT_STATUS.pending} />,
    );

    expect(tree.find('i').props().className).to.contain(
      'fa-exclamation-triangle',
    );
    expect(tree.text()).to.contain('Pending');

    tree.unmount();
  });

  it('should render proposed', () => {
    const tree = shallow(
      <AppointmentStatus status={APPOINTMENT_STATUS.proposed} />,
    );

    expect(tree.find('i').props().className).to.contain(
      'fa-exclamation-triangle',
    );
    expect(tree.text()).to.contain('Pending');

    tree.unmount();
  });

  it('should render cancelled', () => {
    const tree = shallow(
      <AppointmentStatus status={APPOINTMENT_STATUS.cancelled} />,
    );

    expect(tree.find('i').props().className).to.contain(
      'fa-exclamation-circle',
    );
    expect(tree.text()).to.contain('Canceled');

    tree.unmount();
  });

  it('should render null if status === null', () => {
    const tree = shallow(<AppointmentStatus status={null} />);

    expect(tree.type()).to.equal(null);
    tree.unmount();
  });
});
