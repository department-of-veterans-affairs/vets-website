import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import ToDoQuestionnaireItem from '../ToDoQuestionnaireItem';

import upcomingAppointment from './data/upcoming.json';
import cancelledAppointment from './data/cancelled.json';

describe('health care questionnaire list - display a questionnaire item', () => {
  it('basic information - canceled appointment', () => {
    const facilityName = 'Magic Kingdom';
    const clinicName = 'Tomorrowland';
    const data = cancelledAppointment;
    data.location.name = clinicName;
    data.organization.name = facilityName;
    const component = mount(<ToDoQuestionnaireItem data={data} />);
    expect(
      component.find('[data-testid="appointment-location"]').text(),
    ).to.equal(
      'for your canceled or rescheduled appointment at Tomorrowland, Magic Kingdom. You can access this questionnaire to copy answers for a rescheduled appointment.',
    );
    expect(component.find('button').text()).to.equal(
      'View and print questions',
    );
    expect(component.find('[data-testid="due-date"]').text()).to.contain(
      'Access until',
    );
    expect(component.find('[data-testid="due-by-timestamp"]').exists()).to.be
      .false;
    component.unmount();
  });
  it('basic information - future appointment', () => {
    const facilityName = 'Magic Kingdom';
    const clinicName = 'Tomorrowland';
    const data = upcomingAppointment;
    data.location.name = clinicName;
    data.organization.name = facilityName;
    const component = mount(<ToDoQuestionnaireItem data={data} />);
    expect(
      component.find('[data-testid="appointment-location"]').text(),
    ).to.equal('for your appointment at Tomorrowland, Magic Kingdom');
    expect(component.find('button').text()).to.equal('Answer questions');
    expect(component.find('[data-testid="due-date"]').text()).to.contain(
      'Complete by',
    );
    expect(component.find('[data-testid="due-by-timestamp"]').exists()).to.be
      .true;
    component.unmount();
  });
});
