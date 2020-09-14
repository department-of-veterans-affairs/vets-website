import React from 'react';
import { render, screen } from '@testing-library/react';
import FormResult from './FormResult';

describe('FormResult', () => {
  test('renders FormResult component', () => {
    const formState = {
      status: 'incomplete',
    };
    render(<FormResult formState={formState} />);

    expect(
      screen.getByText('Please answer all the questions above'),
    ).toBeInTheDocument();
  });
});
