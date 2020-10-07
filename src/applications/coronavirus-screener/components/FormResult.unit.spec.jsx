import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import FormResult from './FormResult';

describe('FormResult', () => {
  it('shows incomplete message', () => {
    const formState = {
      status: 'incomplete',
    };
    const screen = render(<FormResult formState={formState} />);
    expect(screen.findByText('Please answer all the questions above.')).to.not
      .be.null;
  });
});
