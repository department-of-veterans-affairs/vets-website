import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import ConfirmationPageFooter from '../ConfirmationPageFooter';

import sampleData from '../../../../shared/api/mock-data/fhir/upcoming.appointment.not.started.primary.care.questionnaire.json';

describe('health care questionnaire - confirmation page footer -- phone numbers -- ', () => {
  it('has appointment - show both clinic and facility', () => {
    const mountedComponent = mount(
      <ConfirmationPageFooter context={sampleData} />,
    );
    expect(
      mountedComponent.find('[data-testid="full-details"]').text(),
    ).to.contain('NEW AMSTERDAM CBOC');
    expect(
      mountedComponent.find('[data-testid="full-details"]').text(),
    ).to.contain('800-555-7710');
    expect(
      mountedComponent.find('[data-testid="full-details"]').text(),
    ).to.contain('TEM MH PSO TRS IND93EH 2');
    expect(
      mountedComponent.find('[data-testid="full-details"]').text(),
    ).to.contain('254-743-2867, ext. x0002');
    mountedComponent.unmount();
  });
  it('has appointment - show clinic only', () => {
    const context = {
      appointment: {},
      location: {
        telecom: [
          {
            system: 'phone',
            value: '8889990000',
          },
        ],
        name: 'my friendly clinic name',
        type: [
          {
            coding: [
              {
                display: 'Mental Health',
              },
            ],
            text: 'Mental Health',
          },
        ],
      },
    };
    const mountedComponent = mount(
      <ConfirmationPageFooter context={context} />,
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
    const context = {
      appointment: {},
      organization: {
        telecom: [
          {
            system: 'phone',
            value: '444-555-6666',
          },
        ],
        name: 'my facility name',
        type: [
          {
            coding: [
              {
                display: 'Mental Health',
              },
            ],
            text: 'Mental Health',
          },
        ],
      },
    };
    const mountedComponent = mount(
      <ConfirmationPageFooter context={context} />,
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
    const context = {
      appointment: {},
      location: {},
      organization: {},
    };
    const mountedComponent = mount(
      <ConfirmationPageFooter context={context} />,
    );
    expect(
      mountedComponent.find('[data-testid="default-details"]').text(),
    ).to.contain('call your VA provider');

    mountedComponent.unmount();
  });
});
