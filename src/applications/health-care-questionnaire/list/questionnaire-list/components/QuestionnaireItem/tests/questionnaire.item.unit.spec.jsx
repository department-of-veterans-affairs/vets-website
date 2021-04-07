import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import QuestionnaireItem from '../index';

import upcomingAppointment from './data/upcoming.primary.care.json';
import cancelledAppointment from './data/cancelled.json';
import upcomingMentalHealth from './data/upcoming.mental.health.json';

describe('health care questionnaire list - display a questionnaire item', () => {
  it('appointment information', () => {
    const facilityName = 'Magic Kingdom';
    const clinicName = 'Tomorrowland';
    // upcoming appointment, not started questionnaire
    const data = upcomingAppointment;
    data.location.name = clinicName;
    data.organization.name = facilityName;
    const component = mount(<QuestionnaireItem data={data} />);
    expect(
      component.find('[data-testid="appointment-location"]').text(),
    ).to.contain(facilityName);
    expect(
      component.find('[data-testid="appointment-location"]').text(),
    ).to.contain(clinicName);
    expect(
      component.find('[data-testid="appointment-location"]').text(),
    ).to.equal(`for your appointment at ${clinicName}, ${facilityName}`);

    component.unmount();
  });

  it('due date is shown', () => {
    // upcoming appointment, not started questionnaire
    const data = upcomingAppointment;
    const DueDate = () => <p data-testid="due-date">some data</p>;
    const component = mount(
      <QuestionnaireItem data={data} DueDate={DueDate} />,
    );
    expect(component.find('[data-testid="due-date"]').exists()).to.be.true;

    component.unmount();
  });
  it('Actions are shown', () => {
    // upcoming appointment, not started questionnaire
    const data = upcomingAppointment;
    const Actions = () => <p data-testid="Actions">some data</p>;
    const component = mount(
      <QuestionnaireItem data={data} Actions={Actions} />,
    );
    expect(component.find('[data-testid="Actions"]').exists()).to.be.true;

    component.unmount();
  });
  it('Appointment Type is shown based on clinic', () => {
    // upcoming appointment, not started questionnaire
    const data = upcomingMentalHealth;
    const Actions = () => <p data-testid="Actions">some data</p>;
    const component = mount(
      <QuestionnaireItem data={data} Actions={Actions} />,
    );
    expect(component.find('[data-testid="appointment-type-header"]').exists())
      .to.be.true;
    expect(
      component.find('[data-testid="appointment-type-header"]').text(),
    ).to.equal('Mental health questionnaire');
    component.unmount();
  });
  it('extra text is shown', () => {
    const facilityName = 'Magic Kingdom';
    const clinicName = 'Tomorrowland';
    // upcoming appointment, not started questionnaire
    const data = upcomingAppointment;
    data.location.name = clinicName;
    data.organization.name = facilityName;
    const extra =
      'This is my cool extra message for the that cool cat reading this';
    const component = mount(
      <QuestionnaireItem data={data} extraText={extra} />,
    );
    expect(
      component.find('[data-testid="appointment-location"]').text(),
    ).to.contain(extra);

    expect(
      component.find('[data-testid="appointment-location"]').text(),
    ).to.equal(
      'for your appointment at Tomorrowland, Magic Kingdom. This is my cool extra message for the that cool cat reading this',
    );
    component.unmount();
  });
  it('canceled text is shown for cancelled appointments', () => {
    const facilityName = 'Magic Kingdom';
    const clinicName = 'Tomorrowland';
    // cancelled appointment, completed questionnaire
    const data = cancelledAppointment;
    data.location.name = clinicName;
    data.organization.name = facilityName;
    const component = mount(<QuestionnaireItem data={data} />);
    expect(
      component.find('[data-testid="appointment-location"]').text(),
    ).to.contain('canceled or rescheduled');

    expect(
      component.find('[data-testid="appointment-location"]').text(),
    ).to.equal(
      'for your canceled or rescheduled appointment at Tomorrowland, Magic Kingdom',
    );

    component.unmount();
  });
});
