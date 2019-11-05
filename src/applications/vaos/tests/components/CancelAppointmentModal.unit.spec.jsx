import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CancelAppointmentModal from '../../components/CancelAppointmentModal';
import { FETCH_STATUS } from '../../utils/constants';

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
      />,
    );

    expect(tree.find('Modal').exists()).to.be.true;
    expect(
      tree
        .find('Modal')
        .find('LoadingButton')
        .prop('children'),
    ).to.equal('Yes, cancel');
    expect(
      tree
        .find('Modal')
        .find('button')
        .prop('children'),
    ).to.equal('No, take me back');

    tree.unmount();
  });

  it('should render loading state when cancelling', () => {
    const tree = shallow(
      <CancelAppointmentModal
        showCancelModal
        cancelAppointmentStatus={FETCH_STATUS.loading}
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
        appointmentToCancel={{
          clinicFriendlyName: 'Testing',
          facilityId: '983',
        }}
      />,
    );

    expect(tree.find('Modal').prop('status')).to.equal('error');
    expect(
      tree
        .find('Modal')
        .children()
        .at(5)
        .text(),
    ).to.contain('Testing');

    tree.unmount();
  });
});
