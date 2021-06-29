import React from 'react';
import TextField from '../../src/form-builder/TextField';

import { buildRenderForm } from '../utils';

const renderForm = buildRenderForm({ name: 'asdf' });

describe('Form Builder - TextField', () => {
  test('renders', () => {
    const { getByLabelText } = renderForm(
      <TextField name="thing" label="The Thing" />
    );
    const input = getByLabelText('The Thing');
    expect(input.nodeName).toEqual('INPUT');
    expect(input.getAttribute('type')).toEqual('text');
  });
});
