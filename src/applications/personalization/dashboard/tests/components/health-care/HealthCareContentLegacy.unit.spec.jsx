import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { Toggler } from '~/platform/utilities/feature-toggles';
import { UnconnectedHealthCareContent } from '../../../components/health-care/HealthCareContentLegacy';
import { v2 } from '../../../mocks/appointments';

describe('<UnconnectedHealthCareContent />', () => {
  const initialState = {
    user: {},
  };

  it('should render', () => {
    const tree = renderWithStoreAndRouter(<UnconnectedHealthCareContent />, {
      initialState,
    });

    tree.getByTestId('no-healthcare-text');
    expect(tree.container.querySelector('va-loading-indicator')).to.not.exist;
  });

  it('should render the loading indicator', () => {
    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContent shouldShowLoadingIndicator />,
      { initialState },
    );

    expect(tree.container.querySelector('va-loading-indicator')).to.exist;
  });

  it('should render the HealthcareError', () => {
    // delete instances of Toggler when errors are launched
    const initialErrorState = {
      featureToggles: {
        [Toggler.TOGGLE_NAMES.myVaUpdateErrorsWarnings]: true,
      },
    };
    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContent hasAppointmentsError />,
      { initialErrorState },
    );
    tree.getByTestId('healthcare-error');
  });

  it('should render the Next appointments card', () => {
    const appointments = v2.createAppointmentSuccess().data;
    const appts = appointments.map(appointment => appointment.attributes);

    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContent appointments={appts} />,
      { initialState },
    );

    tree.getByTestId('health-care-appointments-card');
  });

  it('should render the no upcoming appointments text', () => {
    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContent dataLoadingDisabled isVAPatient />,
      { initialState },
    );

    tree.getByTestId('no-upcoming-appointments-text');
  });

  context('should render the HealthCareCTA', () => {
    it('but show only Apply for VA health care and Visit MHV links for a non-patient', () => {
      const tree = renderWithStoreAndRouter(
        <UnconnectedHealthCareContent isVAPatient={false} isLOA1={false} />,
        { initialState },
      );

      tree.getByTestId('apply-va-healthcare-link-from-cta');
      tree.getByTestId('visit-mhv-on-va-gov');
    });

    it("when a patient has appointments and doesn't have an appointment error", () => {
      const appointments = v2.createAppointmentSuccess().data;
      const appts = appointments.map(appointment => appointment.attributes);

      const tree = renderWithStoreAndRouter(
        <UnconnectedHealthCareContent
          appointments={appts}
          dataLoadingDisabled
          isVAPatient
          shouldFetchUnreadMessages
          unreadMessagesCount={2}
        />,
        { initialState },
      );

      tree.getByTestId('visit-mhv-on-va-gov');
      expect(
        tree.getByRole('link', {
          name: /schedule and manage your appointments/i,
          value: {
            text: '/my-health/appointments',
          },
        }),
      ).to.exist;
    });
  });
});
