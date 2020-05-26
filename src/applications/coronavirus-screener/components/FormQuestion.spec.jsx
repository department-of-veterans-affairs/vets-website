import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import FormQuestion from './FormQuestion';

let mockQuestion;
let mockFormState;
let mockSetFormState;
let mockScrollNext;

beforeEach(() => {
  mockQuestion = {
    id: 'sample1',
    text: 'this is question sample1 text',
  };
  mockFormState = {};
  mockSetFormState = () => {};
  mockScrollNext = () => {};
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
        />,
      );
      expect(wrapper.find('.usa-button')).to.have.lengthOf(1);
      expect(wrapper.find('.usa-button-secondary')).to.have.lengthOf(1);
      wrapper.unmount();
    });
  });
});
