import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import FormQuestion from './FormQuestion';
import sinon from 'sinon';

let mockQuestion;
let mockFormState;
let mockSetFormState;
let mockScrollNext;
let mockSetResultSubmittedState;

beforeEach(() => {
  mockQuestion = {
    id: 'sample1',
    text: 'this is question sample1 text',
  };
  mockFormState = {};
  mockSetFormState = () => {};
  mockScrollNext = () => {};
  mockSetResultSubmittedState = () => {};
});

describe('coronavirus-screener', () => {
  describe('FormQuestion', () => {
    it('outputs question text', () => {
      const wrapper = shallow(
        <FormQuestion
          question={mockQuestion}
          formState={mockFormState}
          setFormState={mockSetFormState}
          scrollNext={mockScrollNext}
          setResultSubmittedState={mockSetResultSubmittedState}
        />,
      );
      expect(wrapper.find('h2').text()).to.equal(mockQuestion.text);
      wrapper.unmount();
    });
    it('sets button class when no option is selected', () => {
      const wrapper = shallow(
        <FormQuestion
          question={mockQuestion}
          formState={mockFormState}
          setFormState={mockSetFormState}
          scrollNext={mockScrollNext}
          setResultSubmittedState={mockSetResultSubmittedState}
        />,
      );
      expect(wrapper.find('.usa-button-secondary')).to.have.lengthOf(2);
      expect(wrapper.find('.usa-button')).to.have.lengthOf(0);
      wrapper.unmount();
    });
    it('sets button class when some option is selected', () => {
      mockFormState = {
        sample1: 'yes',
      };
      const wrapper = shallow(
        <FormQuestion
          question={mockQuestion}
          formState={mockFormState}
          setFormState={mockSetFormState}
          scrollNext={mockScrollNext}
          setResultSubmittedState={mockSetResultSubmittedState}
        />,
      );
      expect(wrapper.find('.usa-button')).to.have.lengthOf(1);
      expect(wrapper.find('.usa-button-secondary')).to.have.lengthOf(1);
      wrapper.unmount();
    });

    it('sets form state when clicked', () => {
      const setFormStateSpy = sinon.spy();
      const mockValue = 'yes';
      const mockEvent = { target: { value: mockValue } };
      const expectedFormState = { [mockQuestion.id]: mockValue };

      const wrapper = shallow(
        <FormQuestion
          question={mockQuestion}
          formState={mockFormState}
          setFormState={setFormStateSpy}
          setResultSubmittedState={mockSetResultSubmittedState}
          scrollNext={mockScrollNext}
        />,
      );

      wrapper
        .find('button')
        .at(0)
        .simulate('click', mockEvent);

      expect(setFormStateSpy.called).to.be.true;
      expect(setFormStateSpy.args[0]).to.deep.equal([expectedFormState]);

      wrapper.unmount();
    });
  });
});
