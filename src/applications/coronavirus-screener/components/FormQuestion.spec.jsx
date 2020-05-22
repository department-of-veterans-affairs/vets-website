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
  });
});
