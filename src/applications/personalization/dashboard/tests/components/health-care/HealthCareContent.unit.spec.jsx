import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { Toggler } from '~/platform/utilities/feature-toggles';
import { UnconnectedHealthCareContent } from '../../../components/health-care/HealthCareContent';
import { v2 } from '../../../mocks/appointments';

describe('<UnconnectedHealthCareContent />', () => {
  const initialState = {
    user: {},
  };

  it('should render', () => {
    const tree = renderWithStoreAndRouter(<UnconnectedHealthCareContent />, {
      initialState,
    });

    tree.getByTestId('no-health-care-notice');
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
    tree.getByTestId('appointments-error');
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

    tree.getByTestId('no-upcoming-appointments-card');
  });
});
