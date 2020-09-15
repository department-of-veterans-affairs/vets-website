import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import FormResult from './FormResult';

describe('FormResult', () => {
  it('renders FormResult component', async () => {
    const formState = {
      status: 'incomplete',
    };
    render(<FormResult formState={formState} />);

    // screen.debug();

    expect(await screen.findByText('Please answer all the questions above.')).to
      .not.be.null;
  });
});
