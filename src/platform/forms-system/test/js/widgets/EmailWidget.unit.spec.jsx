import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import EmailWidget from '../../../src/js/widgets/EmailWidget';

describe('Schemaform <EmailWidget>', () => {
  it('should render', () => {
    const { container } = render(
      <EmailWidget 
        schema={{}}
        onChange={() => {}}
        onBlur={() => {}}
        formContext={{}}
        options={{}}
      />,
    );
    const input = container.querySelector('input[type="email"]');
    expect(input).to.exist;
  });
});
