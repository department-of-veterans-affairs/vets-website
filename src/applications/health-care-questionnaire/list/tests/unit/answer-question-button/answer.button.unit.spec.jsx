import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import AnswerQuestions from '../../../questionnaire-list/components/Shared/Buttons/AnswerQuestions';

describe('health care questionnaire list - shows view and print button', () => {
  it('show continue progress', () => {
    const component = mount(<AnswerQuestions status="in-progress" />);
    expect(component.exists('[data-testid="button-text"]')).to.be.true;
    expect(component.find('[data-testid="button-text"]').text()).to.equal(
      'Continue questions',
    );
    component.unmount();
  });
  it('show start questions', () => {
    const component = mount(<AnswerQuestions />);
    expect(component.exists('[data-testid="button-text"]')).to.be.true;
    expect(component.find('[data-testid="button-text"]').text()).to.equal(
      'Answer questions',
    );
    component.unmount();
  });
});
