import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import FormQuestion from './FormQuestion';
import sinon from 'sinon';

let mockQuestion;
let mockRecordStart;
let mockOptionsConfig;
let mockSetQuestionValue;
let mockclearQuestionValues;

beforeEach(() => {
  mockQuestion = {
    id: 'sample1',
    text: 'this is question sample1 text',
  };
  mockRecordStart = () => {};
  mockOptionsConfig = [
    { optionValue: 'yes', optionText: 'Yes' },
    { optionValue: 'no', optionText: 'No' },
  ];
  mockSetQuestionValue = () => {};
  mockclearQuestionValues = () => {};
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
          clearQuestionValues={mockclearQuestionValues}
        />,
      );
      expect(wrapper.find('h2').text()).to.equal(mockQuestion.text);
      wrapper.unmount();
    });
    it('sets button class when no option is selected', () => {
      const wrapper = shallow(
        <FormQuestion
          question={mockQuestion}
          recordStart={mockRecordStart}
          optionsConfig={mockOptionsConfig}
          setQuestionValue={mockSetQuestionValue}
          clearQuestionValues={mockclearQuestionValues}
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
          clearQuestionValues={mockclearQuestionValues}
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
          clearQuestionValues={mockclearQuestionValues}
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
