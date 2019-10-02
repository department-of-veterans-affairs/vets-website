import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { ConfirmedAppointmentDetailPage } from '../../containers/ConfirmedAppointmentDetailPage';

describe('VAOS <ConfirmedAppointmentDetailPage>', () => {
  describe('VA appointment', () => {
    const appointment = {
      startDate: '2019-08-16T18:57:00',
      facilityId: '234',
      clinicId: '456',
      vdsAppointments: [
        {
          clinic: {
            name: 'John Hopkins Medical Center',
          },
        },
      ],
    };

    it('should render a loading indicator', () => {
      const fetchConfirmedAppointments = sinon.spy();
      const tree = shallow(
        <ConfirmedAppointmentDetailPage
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
        <ConfirmedAppointmentDetailPage
          fetchConfirmedAppointments={fetchConfirmedAppointments}
          appointment={appointment}
          status="succeeded"
        />,
      );

      expect(fetchConfirmedAppointments.called).to.be.true;
      expect(tree.find('LoadingIndicator').exists()).to.be.false;
      expect(tree.text()).to.contain(
        appointment.vdsAppointments[0].clinic.name,
      );
      tree.unmount();
    });
  });
});
