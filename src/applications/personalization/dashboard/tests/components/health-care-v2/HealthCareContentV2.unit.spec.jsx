import React from 'react';
import { expect } from 'chai';

import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { Toggler } from '~/platform/utilities/feature-toggles/Toggler';
import { UnconnectedHealthCareContentV2 } from '../../../components/health-care-v2/HealthCareContentV2';
import { createVaosAppointment } from '../../../mocks/appointments/vaos-v2';

describe('<UnconnectedHealthCareContentV2 />', () => {
  // delete instances of Toggler when new appts URL is launched
  const initialLinkState = {
    featureToggles: {
      [Toggler.TOGGLE_NAMES.vaOnlineSchedulingBreadcrumbUrlUpdate]: true,
    },
  };

  it('should render', () => {
    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContentV2 />,
      initialLinkState,
    );

    tree.getByTestId('no-healthcare-text-v2');
    expect(tree.container.querySelector('va-loading-indicator')).to.not.exist;
    expect(tree.queryByTestId('cerner-widget')).to.be.null;
  });

  it('should render the loading indicator', () => {
    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContentV2 shouldShowLoadingIndicator />,
      initialLinkState,
    );

    expect(tree.container.querySelector('va-loading-indicator')).to.exist;
  });

  it('should render the Cerner widget', () => {
    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContentV2 facilityNames={['do', 're', 'mi']} />,
      initialLinkState,
    );

    tree.getByTestId('cerner-widget');
  });

  it('should render the unread message alert', () => {
    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContentV2
        shouldFetchUnreadMessages
        unreadMessagesCount={2}
      />,
      initialLinkState,
    );

    tree.getByTestId('unread-messages-alert-v2');
    tree.getByText('You have 2 unread messages.');
    tree.getByText('Review your messages');
  });

  it('should render the HealthcareError', () => {
    // delete instances of Toggler when errors are launched
    const initialErrorState = {
      featureToggles: {
        [Toggler.TOGGLE_NAMES.myVaUpdateErrorsWarnings]: true,
      },
    };
    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContentV2 hasAppointmentsError />,
      { initialErrorState },
    );
    tree.getByTestId('healthcare-error-v2');
  });

  it('should render the Next appointments card', () => {
    const appointments = [createVaosAppointment()];
    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContentV2 appointments={appointments} />,
      initialLinkState,
    );

    tree.getByTestId('health-care-appointments-card-v2');
  });

  it('should render the no upcoming appointments text', () => {
    const tree = renderWithStoreAndRouter(
      <UnconnectedHealthCareContentV2 dataLoadingDisabled isVAPatient />,
      initialLinkState,
    );

    tree.getByTestId('no-upcoming-appointments-text-v2');
  });

  context('should render the HealthCareCTA', () => {
    it('but show only Apply for VA health care link for a non-patient', () => {
      const tree = renderWithStoreAndRouter(
        <UnconnectedHealthCareContentV2 isVAPatient={false} />,
        initialLinkState,
      );

      tree.getAllByTestId('apply-va-healthcare-link-from-cta');
    });

    it("when a patient has appointments and doesn't have an appointment error", () => {
      const appointments = [createVaosAppointment()];
      const tree = renderWithStoreAndRouter(
        <UnconnectedHealthCareContentV2
          appointments={appointments}
          dataLoadingDisabled
          isVAPatient
          shouldFetchUnreadMessages
          unreadMessagesCount={2}
        />,
        initialLinkState,
      );

      tree.getByText('Popular actions for Health Care');
    });
  });
});
