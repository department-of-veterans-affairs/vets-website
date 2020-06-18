import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import MultiQuestionForm from './MultiQuestionForm';
import sinon from 'sinon';

let mockQuestions;
let mockDefaultOptions;

beforeEach(() => {
  mockQuestions = [
    {
      id: 'myFirstQuestion',
      text: 'This is the first question text',
      startQuestion: true,
    },
    {
      id: 'mySecondQuestion',
      text: 'This is the second question text',
    },
  ];
  mockDefaultOptions = [
    { optionValue: 'yes', optionText: 'Yes' },
    { optionValue: 'no', optionText: 'No' },
  ];
});

describe('coronavirus-screener', () => {
  describe('MultiQuestionForm', () => {
    it('shows first question', () => {
      const wrapper = shallow(
        <MultiQuestionForm
          questions={mockQuestions}
          defaultOptions={mockDefaultOptions}
        />,
      );

      const firstQuestionId = `#question-${mockQuestions[0].id}`;
      const firstQuestionText = mockQuestions[0].text;

      const firstQuestion = wrapper
        .children()
        .first()
        .dive()
        .find(firstQuestionId);

      expect(firstQuestion.find('h2').text()).to.equal(firstQuestionText);

      wrapper.unmount();
    });
  });
});
