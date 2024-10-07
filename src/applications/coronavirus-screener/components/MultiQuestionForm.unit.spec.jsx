import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import MultiQuestionForm from './MultiQuestionForm';

let mockQuestions;
let mockDefaultOptions;
let mockSelectedLanguage;

beforeEach(() => {
  mockQuestions = [
    {
      id: 'myFirstQuestion',
      text: {
        en: 'This is the first question text',
        es: 'Este es el primer texto de la pregunta',
      },
      startQuestion: true,
    },
    {
      id: 'mySecondQuestion',
      text: {
        en: 'This is the second question text',
        es: 'Este es el texto de la segunda pregunta',
      },
    },
  ];
  mockDefaultOptions = [
    {
      optionValue: 'yes',
      optionText: {
        en: 'Yes',
        es: 'Sí',
      },
    },
    {
      optionValue: 'no',
      optionText: {
        en: 'No',
        es: 'No',
      },
    },
  ];
  mockSelectedLanguage = 'es';
});

describe('coronavirus-screener', () => {
  describe('MultiQuestionForm', () => {
    it('shows first question', () => {
      const wrapper = shallow(
        <MultiQuestionForm
          questions={mockQuestions}
          defaultOptions={mockDefaultOptions}
          selectedLanguage={mockSelectedLanguage}
        />,
      );

      const firstQuestionId = `#question-${mockQuestions[0].id}`;
      const firstQuestionText = mockQuestions[0].text[mockSelectedLanguage];
      const firstQuestionFirstButtonText =
        mockDefaultOptions[0].optionText[mockSelectedLanguage];

      const firstQuestion = wrapper
        .children()
        .first()
        .dive()
        .find(firstQuestionId);
      expect(firstQuestion.find('h2').text()).to.equal(firstQuestionText);
      expect(
        firstQuestion
          .find('button')
          .children()
          .first()
          .text(),
      ).to.equal(firstQuestionFirstButtonText);

      wrapper.unmount();
    });
  });
});
