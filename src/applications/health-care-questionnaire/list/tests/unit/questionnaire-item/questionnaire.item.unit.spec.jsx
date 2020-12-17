import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import QuestionnaireItem from '../../../questionnaire-list/components/QuestionnaireItem';

describe('health care questionnaire list - display a questionnaire item', () => {
  it('appointment information', () => {
    const name = 'Magic Kingdom';
    const data = {
      appointment: {
        facilityName: name,
        appointmentTime: '2021-02-23T15:00:00Z',
      },
    };
    const component = mount(<QuestionnaireItem data={data} />);
    expect(component.find('[data-testid="facility-name"]').text()).to.equal(
      name,
    );

    expect(component.find('[data-testid="appointment-time"]').text()).to.equal(
      'February 23, 2021',
    );

    component.unmount();
  });

  it('due date is shown', () => {
    const name = 'Magic Kingdom';
    const data = {
      appointment: {
        facilityName: name,
        appointmentTime: '2021-02-23T15:00:00Z',
      },
    };

    const DueDate = () => <p data-testid="due-date">some data</p>;
    const component = mount(
      <QuestionnaireItem data={data} DueDate={DueDate} />,
    );
    expect(component.find('[data-testid="due-date"]').exists()).to.be.true;

    component.unmount();
  });
  it('Actions are shown', () => {
    const name = 'Magic Kingdom';
    const data = {
      appointment: {
        facilityName: name,
        appointmentTime: '2021-02-23T15:00:00Z',
      },
    };

    const Actions = () => <p data-testid="Actions">some data</p>;

    const component = mount(
      <QuestionnaireItem data={data} Actions={Actions} />,
    );
    expect(component.find('[data-testid="Actions"]').exists()).to.be.true;

    component.unmount();
  });
});
