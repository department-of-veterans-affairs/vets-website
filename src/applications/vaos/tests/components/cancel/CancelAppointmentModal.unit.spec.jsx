import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CancelAppointmentModal from '../../../components/cancel/CancelAppointmentModal';
import { FETCH_STATUS } from '../../../utils/constants';

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
          appointmentTime: '01/22/2020',
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
          vvsAppointments: [{}],
        }}
        cancelAppointmentStatus={FETCH_STATUS.succeeded}
      />,
    );

    expect(tree.find('CancelVideoAppointmentModal').exists()).to.be.true;

    tree.unmount();
  });

  it('should render Cerner view', () => {
    const tree = shallow(
      <CancelAppointmentModal
        showCancelModal
        appointmentToCancel={{
          clinicId: '123',
          startDate: '11/20/2018',
          clinicFriendlyName: 'Testing',
          facilityId: '123',
        }}
        cernerFacilities={['123']}
      />,
    );

    expect(tree.find('CancelCernerAppointmentModal').exists()).to.be.true;

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
          clinicId: '123',
          startDate: '11/20/2018',
          clinicFriendlyName: 'Testing',
          facilityId: '983',
        }}
      />,
    );

    expect(tree.find('CancelAppointmentFailedModal').exists()).to.be.true;
    tree.unmount();
  });
});
