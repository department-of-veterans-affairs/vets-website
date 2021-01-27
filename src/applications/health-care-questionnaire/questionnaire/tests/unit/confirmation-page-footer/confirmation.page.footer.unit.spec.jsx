import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import ConfirmationPageFooter from '../../../components/get-help/ConfirmationPageFooter';

describe('health care questionnaire - confirmation page footer -- phone numbers -- ', () => {
  it('has appointment - show both clinic and facility', () => {
    const appointment = {
      attributes: {
        clinicFriendlyName: 'my friendly clinic name',
        facilityId: '983',
        vdsAppointments: [
          {
            clinic: {
              name: 'CHY PC VAR2',
              phoneNumber: '8889990000',
              facility: {
                displayName: 'my facility name',
                phoneNumber: '4445556666',
              },
            },
          },
        ],
      },
    };
    const mountedComponent = mount(
      <ConfirmationPageFooter appointment={appointment} />,
    );
    expect(
      mountedComponent.find('[data-testid="full-details"]').text(),
    ).to.contain('my facility name');
    expect(
      mountedComponent.find('[data-testid="full-details"]').text(),
    ).to.contain('444-555-6666');
    expect(
      mountedComponent.find('[data-testid="full-details"]').text(),
    ).to.contain('my friendly clinic name');
    expect(
      mountedComponent.find('[data-testid="full-details"]').text(),
    ).to.contain('888-999-0000');
    mountedComponent.unmount();
  });
  it('has appointment - show clinic only', () => {
    const appointment = {
      attributes: {
        clinicFriendlyName: 'my friendly clinic name',
        facilityId: '983',
        vdsAppointments: [
          {
            clinic: {
              name: 'CHY PC VAR2',
              phoneNumber: '8889990000',
              facility: {
                displayName: 'my facility name',
              },
            },
          },
        ],
      },
    };
    const mountedComponent = mount(
      <ConfirmationPageFooter appointment={appointment} />,
    );
    expect(
      mountedComponent.find('[data-testid="clinic-only-details"]').text(),
    ).to.contain('my friendly clinic name');
    expect(
      mountedComponent.find('[data-testid="clinic-only-details"]').text(),
    ).to.contain('888-999-0000');
    mountedComponent.unmount();
  });
  it('has appointment - show facility only', () => {
    const appointment = {
      attributes: {
        clinicFriendlyName: 'my friendly clinic name',
        facilityId: '983',
        vdsAppointments: [
          {
            clinic: {
              name: 'CHY PC VAR2',

              facility: {
                displayName: 'my facility name',
                phoneNumber: '4445556666',
              },
            },
          },
        ],
      },
    };
    const mountedComponent = mount(
      <ConfirmationPageFooter appointment={appointment} />,
    );
    expect(
      mountedComponent.find('[data-testid="facility-only-details"]').text(),
    ).to.contain('my facility name');
    expect(
      mountedComponent.find('[data-testid="facility-only-details"]').text(),
    ).to.contain('444-555-6666');
    mountedComponent.unmount();
  });
  it('has appointment - show default links only', () => {
    const appointment = {
      attributes: {
        clinicFriendlyName: 'my friendly clinic name',
        facilityId: '983',
        vdsAppointments: [
          {
            clinic: {
              name: 'CHY PC VAR2',
              facility: {
                displayName: 'my facility name',
              },
            },
          },
        ],
      },
    };
    const mountedComponent = mount(
      <ConfirmationPageFooter appointment={appointment} />,
    );
    expect(
      mountedComponent.find('[data-testid="default-details"]').text(),
    ).to.contain('call your VA provider');

    mountedComponent.unmount();
  });
});
