import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import FormResult from './FormResult';

describe('FormResult', () => {
  it('shows incomplete message', () => {
    const formState = {
      status: 'incomplete',
    };
    // unclear why screen variable has to be created instead of imported such as https://testing-library.com/docs/react-testing-library/example-intro#full-example
    const screen = render(<FormResult formState={formState} />);
    expect(screen.findByText('Please answer all the questions above.')).to.not
      .be.null;
  });
});
