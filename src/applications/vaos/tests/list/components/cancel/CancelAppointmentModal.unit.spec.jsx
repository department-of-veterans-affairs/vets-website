import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CancelAppointmentModal from '../../../../appointment-list/components/cancel/CancelAppointmentModal';
import {
  FETCH_STATUS,
  APPOINTMENT_TYPES,
  VIDEO_TYPES,
  APPOINTMENT_STATUS,
} from '../../../../utils/constants';

describe('VAOS <CancelAppointmentModal>', () => {
  it('should not render modal if showCancelModal is false', () => {
    const tree = shallow(<CancelAppointmentModal showCancelModal={false} />);

    expect(tree.text()).to.equal('');

    tree.unmount();
  });

  it('should render confirmation modal', () => {
    const tree = shallow(
      <CancelAppointmentModal
        showCancelModal
        appointmentToCancel={{}}
        cancelAppointmentStatus={FETCH_STATUS.notStarted}
      />,
    );

    expect(tree.find('CancelAppointmentConfirmationModal').exists()).to.be.true;

    tree.unmount();
  });

  it('should render community care view', () => {
    const tree = shallow(
      <CancelAppointmentModal
        showCancelModal
        appointmentToCancel={{
          vaos: { appointmentType: APPOINTMENT_TYPES.ccAppointment },
        }}
        cancelAppointmentStatus={FETCH_STATUS.succeeded}
      />,
    );

    expect(tree.find('CancelCommunityCareAppointmentModal').exists()).to.be
      .true;

    tree.unmount();
  });

  it('should render video connect view', () => {
    const tree = shallow(
      <CancelAppointmentModal
        showCancelModal
        appointmentToCancel={{
          status: APPOINTMENT_STATUS.booked,
          contained: [
            {
              resourceType: 'HealthcareService',
              characteristic: [{ coding: VIDEO_TYPES.videoConnect }],
            },
          ],
          vaos: {
            appointmentType: APPOINTMENT_TYPES.vaAppointment,
          },
        }}
        cancelAppointmentStatus={FETCH_STATUS.succeeded}
      />,
    );

    expect(tree.find('CancelVideoAppointmentModal').exists()).to.be.true;

    tree.unmount();
  });

  it('should render success state', () => {
    const tree = shallow(
      <CancelAppointmentModal
        showCancelModal
        appointmentToCancel={{}}
        cancelAppointmentStatus={FETCH_STATUS.succeeded}
      />,
    );

    expect(tree.find('CancelAppointmentSucceededModal').exists()).to.be.true;

    tree.unmount();
  });

  it('should render error state', () => {
    const tree = shallow(
      <CancelAppointmentModal
        showCancelModal
        cancelAppointmentStatus={FETCH_STATUS.failed}
        appointmentToCancel={{
          appointmentType: APPOINTMENT_TYPES.vaAppointment,
        }}
      />,
    );

    expect(tree.find('CancelAppointmentFailedModal').exists()).to.be.true;
    tree.unmount();
  });
});
