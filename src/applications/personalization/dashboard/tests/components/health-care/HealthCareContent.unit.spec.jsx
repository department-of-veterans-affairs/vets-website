import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { externalServices } from '@department-of-veterans-affairs/platform-monitoring';
import { UnconnectedHealthCareContent } from '../../../components/health-care/HealthCareContent';
import { v2 } from '../../../mocks/appointments';

describe('<UnconnectedHealthCareContent /> Downtime Handling', () => {
  const initialState = {
    user: {},
  };

  it('should show downtime alert for all services and hide links', () => {
    const mockDowntime = {
      status: 'down',
      externalService: externalServices.MY_HEALTH,
    };

    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContent isVAPatient downtimeData={mockDowntime} />,
      { initialState },
    );

    expect(tree.getByText(/some VA health care services are down/i)).to.exist;
    expect(tree.queryByTestId('health-care-appointments-card')).to.not.exist;
    expect(tree.queryByTestId('visit-mhv-on-va-gov')).to.not.exist;
  });

  it('should hide the appointments card during appointments downtime only', () => {
    const appointmentsDowntime = {
      status: 'down',
      externalService: externalServices.VA_APPOINTMENTS,
    };

    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContent
        isVAPatient
        downtimeData={appointmentsDowntime}
      />,
      { initialState },
    );

    expect(tree.queryByTestId('health-care-appointments-card')).to.not.exist;
    expect(tree.getByTestId('visit-mhv-on-va-gov')).to.exist;
  });

  it('should render HealthcareError when appointments fail', () => {
    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContent hasAppointmentsError isVAPatient />,
      { initialState },
    );

    tree.getByTestId('healthcare-error');
  });

  it('should render appointments card when no downtime', () => {
    const appointments = v2.createAppointmentSuccess().data;
    const appts = appointments.map(appointment => appointment.attributes);

    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContent appointments={appts} isVAPatient />,
      { initialState },
    );

    tree.getByTestId('health-care-appointments-card');
  });
});
