import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import Status from '../../../questionnaire-list/components/Shared/Labels/Status';

import inProgressAppointment from '../../../../shared/api/mock-data/fhir/upcoming.appointment.in.progress.primary.care.questionnaire.json';
import notStartedAppointment from '../../../../shared/api/mock-data/fhir/upcoming.appointment.not.started.mental.health.questionnaire.json';
import cancelledAppointment from '../../../../shared/api/mock-data/fhir/cancelled.appointment.completed.primary.care.questionnaire.json';
import completedAppointment from '../../../../shared/api/mock-data/fhir/upcoming.appointment.completed.primary.care.questionnaire.json';

describe('health care questionnaire list - get status label', () => {
  it('in progress label', () => {
    const data = inProgressAppointment;
    const component = mount(<Status data={data} />);
    expect(component.exists('[data-testid="status-label"]')).to.be.true;
    expect(component.find('[data-testid="status-label"]').text()).to.equal(
      'in-progress',
    );
    component.unmount();
  });
  it('not started label', () => {
    const data = notStartedAppointment;
    const component = mount(<Status data={data} />);
    expect(component.exists('[data-testid="status-label"]')).to.be.true;
    expect(component.find('[data-testid="status-label"]').text()).to.equal(
      'not started',
    );
    component.unmount();
  });
  it('canceled label', () => {
    const data = cancelledAppointment;
    const component = mount(<Status data={data} />);
    expect(component.exists('[data-testid="status-label"]')).to.be.true;
    expect(component.find('[data-testid="status-label"]').text()).to.equal(
      'canceled',
    );
    component.unmount();
  });
  it('completed, should hide label', () => {
    const data = completedAppointment;
    const component = mount(<Status data={data} />);
    expect(component.exists('[data-testid="status-label"]')).to.be.false;

    component.unmount();
  });
});
