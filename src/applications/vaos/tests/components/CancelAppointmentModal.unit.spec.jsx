import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CancelAppointmentModal from '../../components/CancelAppointmentModal';
import { FETCH_STATUS } from '../../utils/constants';

const vaAppointment = {
  clinicId: '123',
  startDate: '11/20/2018',
  clinicFriendlyName: 'Testing',
  facilityId: '983',
};

const ccAppointment = {
  appointmentTime: '01/25/2019 13:30:00',
  providerPractice: 'Atlantic Medical Care',
  providerPhone: '(407) 555-1212',
};

const videoAppointment = {
  ...vaAppointment,
  vvsAppointments: [{}],
};

const facility = {
  name: 'Cheyenne VA Medical Center',
  phone: {
    main: '307-778-7550',
  },
};

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
        cancelAppointmentStatus={FETCH_STATUS.notStarted}
        appointmentToCancel={vaAppointment}
      />,
    );

    expect(tree.find('Modal').exists()).to.be.true;
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
        .prop('children'),
    ).to.equal('No, take me back');

    tree.unmount();
  });

  it('should render a modal for cc appointments', () => {
    const tree = shallow(
      <CancelAppointmentModal
        showCancelModal
        cancelAppointmentStatus={FETCH_STATUS.notStarted}
        appointmentToCancel={ccAppointment}
      />,
    );

    const modal = tree.find('Modal');

    expect(modal.exists()).to.be.true;
    expect(modal.props().title).to.equal(
      'You have to call your provider to cancel this appointment',
    );
    expect(modal.find('.usa-button').prop('children')).to.equal('OK');
    expect(
      modal
        .children()
        .at(1)
        .text(),
    ).to.contain(ccAppointment.providerPractice);

    expect(
      modal
        .children()
        .at(1)
        .text(),
    ).to.contain('407-555-1212');

    expect(modal.find('a').props().href).to.equal('tel:4075551212');

    tree.unmount();
  });

  it('should render a modal for video appointments', () => {
    const tree = shallow(
      <CancelAppointmentModal
        showCancelModal
        cancelAppointmentStatus={FETCH_STATUS.notStarted}
        appointmentToCancel={videoAppointment}
        facility={facility}
      />,
    );

    const modal = tree.find('Modal');

    expect(modal.exists()).to.be.true;
    expect(modal.props().title).to.equal(
      'You have to call your provider to cancel this appointment',
    );
    expect(modal.find('.usa-button').prop('children')).to.equal('OK');
    expect(
      modal
        .children()
        .at(1)
        .text(),
    ).to.contain(facility.name);

    expect(
      modal
        .children()
        .at(1)
        .text(),
    ).to.contain(facility.phone.main);

    expect(modal.find('a').props().href).to.equal('tel:3077787550');

    tree.unmount();
  });

  it('should render loading state when cancelling', () => {
    const tree = shallow(
      <CancelAppointmentModal
        showCancelModal
        cancelAppointmentStatus={FETCH_STATUS.loading}
        appointmentToCancel={vaAppointment}
      />,
    );

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
        .props().disabled,
    ).to.be.true;

    tree.unmount();
  });

  it('should render success state', () => {
    const tree = shallow(
      <CancelAppointmentModal
        showCancelModal
        cancelAppointmentStatus={FETCH_STATUS.succeeded}
        appointmentToCancel={vaAppointment}
      />,
    );

    expect(tree.find('Modal').prop('status')).to.equal('success');
    expect(
      tree
        .find('Modal')
        .find('button')
        .exists(),
    ).to.be.true;

    tree.unmount();
  });

  it('should render error state', () => {
    const tree = shallow(
      <CancelAppointmentModal
        showCancelModal
        cancelAppointmentStatus={FETCH_STATUS.failed}
        appointmentToCancel={vaAppointment}
      />,
    );

    expect(tree.find('Modal').prop('status')).to.equal('error');
    expect(
      tree
        .find('Modal')
        .children()
        .at(2)
        .text(),
    ).to.contain('Testing');

    tree.unmount();
  });
});
