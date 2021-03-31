import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import AnswerQuestions from '../AnswerQuestions';

describe('health care questionnaire list - shows view and print button', () => {
  it('show continue progress', () => {
    const component = mount(
      <AnswerQuestions
        status="in-progress"
        facilityName="Magic Kingdom"
        appointmentTime="2021-10-31T17:00:00Z"
      />,
    );
    expect(component.exists('[data-testid="button-text"]')).to.be.true;
    expect(component.find('[data-testid="button-text"]').text()).to.equal(
      'Continue questions',
    );
    expect(component.exists('[data-testid="answer-button"]')).to.be.true;
    expect(
      component.find('[data-testid="answer-button"]').prop('aria-label'),
    ).to.equal(
      'Select to continue your pre-appointment questionnaire for your primary care visit at Magic Kingdom on October, 31, 2021',
    );
    component.unmount();
  });
  it('show start questions', () => {
    const component = mount(
      <AnswerQuestions
        facilityName="Magic Kingdom"
        appointmentTime="2021-10-31T17:00:00Z"
      />,
    );
    expect(component.exists('[data-testid="button-text"]')).to.be.true;
    expect(component.find('[data-testid="button-text"]').text()).to.equal(
      'Answer questions',
    );
    expect(component.exists('[data-testid="answer-button"]')).to.be.true;
    expect(
      component.find('[data-testid="answer-button"]').prop('aria-label'),
    ).to.equal(
      'Select to start your pre-appointment questionnaire for your primary care visit at Magic Kingdom on October, 31, 2021',
    );
    component.unmount();
  });
});
