import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import Status from '../../../questionnaire-list/components/Shared/Labels/Status';

describe('health care questionnaire list - get status label', () => {
  it('in progress label', () => {
    const data = {
      appointment: {
        attributes: { vdsAppointments: [{ currentStatus: 'FUTURE' }] },
      },
      questionnaire: [{ questionnaireResponse: { status: 'in-progress' } }],
    };
    const component = mount(<Status data={data} />);
    expect(component.exists('[data-testid="status-label"]')).to.be.true;
    expect(component.find('[data-testid="status-label"]').text()).to.equal(
      'in-progress',
    );
    component.unmount();
  });
  it('not started label', () => {
    const data = {
      appointment: {
        attributes: { vdsAppointments: [{ currentStatus: 'FUTURE' }] },
      },
      questionnaire: [{ questionnaireResponse: {} }],
    };
    const component = mount(<Status data={data} />);
    expect(component.exists('[data-testid="status-label"]')).to.be.true;
    expect(component.find('[data-testid="status-label"]').text()).to.equal(
      'not started',
    );
    component.unmount();
  });
  it('canceled label', () => {
    const data = {
      appointment: {
        attributes: { vdsAppointments: [{ currentStatus: 'CANCELLED' }] },
      },
      questionnaire: [{ questionnaireResponse: {} }],
    };
    const component = mount(<Status data={data} />);
    expect(component.exists('[data-testid="status-label"]')).to.be.true;
    expect(component.find('[data-testid="status-label"]').text()).to.equal(
      'canceled',
    );
    component.unmount();
  });
  it('completed, should hide label', () => {
    const data = {
      appointment: {
        attributes: { vdsAppointments: [{ currentStatus: '' }] },
      },
      questionnaire: [{ questionnaireResponse: { status: 'completed' } }],
    };
    const component = mount(<Status data={data} />);
    expect(component.exists('[data-testid="status-label"]')).to.be.false;

    component.unmount();
  });
});
