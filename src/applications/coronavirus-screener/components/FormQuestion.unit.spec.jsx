import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import FormQuestion from './FormQuestion';

let mockQuestion;
let mockRecordStart;
let mockOptionsConfig;
let mockSetQuestionValue;
let mockClearQuestionValues;
let mockSelectedLanguage;

beforeEach(() => {
  mockQuestion = {
    id: 'sample1',
    text: {
      en: 'this is question sample1 text',
      es: 'este es el texto de la pregunta sample1',
    },
  };
  mockRecordStart = () => {};
  mockOptionsConfig = [
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
  mockSetQuestionValue = () => {};
  mockClearQuestionValues = () => {};
  mockSelectedLanguage = 'es';
});

describe('coronavirus-screener', () => {
  describe('FormQuestion', () => {
    it('outputs question text', () => {
      const wrapper = shallow(
        <FormQuestion
          question={mockQuestion}
          recordStart={mockRecordStart}
          optionsConfig={mockOptionsConfig}
          setQuestionValue={mockSetQuestionValue}
          clearQuestionValues={mockClearQuestionValues}
          selectedLanguage={mockSelectedLanguage}
        />,
      );
      expect(wrapper.find('h2').text()).to.equal(
        mockQuestion.text[mockSelectedLanguage],
      );
      wrapper.unmount();
    });
    it('sets button class when no option is selected', () => {
      const wrapper = shallow(
        <FormQuestion
          question={mockQuestion}
          recordStart={mockRecordStart}
          optionsConfig={mockOptionsConfig}
          setQuestionValue={mockSetQuestionValue}
          clearQuestionValues={mockClearQuestionValues}
        />,
      );
      expect(wrapper.find('.usa-button-secondary')).to.have.lengthOf(2);
      expect(wrapper.find('.vads-u-background-color--white')).to.have.lengthOf(
        2,
      );
      expect(wrapper.find('.usa-button')).to.have.lengthOf(0);
      wrapper.unmount();
    });
    it('sets button class when some option is selected', () => {
      mockQuestion.value = 'yes';
      const wrapper = shallow(
        <FormQuestion
          question={mockQuestion}
          recordStart={mockRecordStart}
          optionsConfig={mockOptionsConfig}
          setQuestionValue={mockSetQuestionValue}
          clearQuestionValues={mockClearQuestionValues}
        />,
      );
      expect(wrapper.find('.usa-button')).to.have.lengthOf(1);
      expect(wrapper.find('.usa-button-secondary')).to.have.lengthOf(1);
      expect(wrapper.find('.vads-u-background-color--white')).to.have.lengthOf(
        1,
      );
      wrapper.unmount();
    });

    it('sets question value in state when clicked', () => {
      const setQuestionValueSpy = sinon.spy();
      const mockValue = 'yes';
      const mockEvent = { target: { value: mockValue } };
      const expectedArguments = {
        event: mockEvent,
        questionId: mockQuestion.id,
      };

      const wrapper = shallow(
        <FormQuestion
          question={mockQuestion}
          recordStart={mockRecordStart}
          optionsConfig={mockOptionsConfig}
          setQuestionValue={setQuestionValueSpy}
          clearQuestionValues={mockClearQuestionValues}
        />,
      );

      wrapper
        .find('button')
        .at(0)
        .simulate('click', mockEvent);

      expect(setQuestionValueSpy.called).to.be.true;
      expect(setQuestionValueSpy.args[0]).to.deep.equal([expectedArguments]);

      wrapper.unmount();
    });
  });
});
