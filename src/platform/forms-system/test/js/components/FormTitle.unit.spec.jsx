import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import FormTitle from '../../../src/js/components/FormTitle';

describe('Schemaform <FormTitle>', () => {
  it('should render', () => {
    const { container } = render(
      <FormTitle title="My title" subTitle="My subtitle" />,
    );

    expect(container.textContent).to.contain('My title');
    expect(container.textContent).to.contain('My subtitle');
  });
});
