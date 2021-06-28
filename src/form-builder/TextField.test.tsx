import React from 'react';
import TextField from './TextField';
import { render } from '@testing-library/react';

describe('Form Builder - TextField', () => {
  test('renders', () => {
    const { getByLabelText } = render(
      <TextField name="thing" label="The Thing" />
    );
    expect(getByLabelText('The Thing')).toBeTruthy();
  });
});
