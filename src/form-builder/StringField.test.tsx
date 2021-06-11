import React from 'react';
import StringField from './StringField';
import { render } from '@testing-library/react';

describe('Form Builder - StringField', () => {
  test('renders', () => {
    const { getByLabelText } = render(<StringField name="thing" />);
    expect(getByLabelText('thing')).toBeTruthy();
  });
});
