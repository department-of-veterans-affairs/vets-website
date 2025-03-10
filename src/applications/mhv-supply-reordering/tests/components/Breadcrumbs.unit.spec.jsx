import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import Breadcrumbs from '../../components/Breadcrumbs';

describe('Breadcrumbs', () => {
  it('renders', () => {
    const { getByTestId } = render(<Breadcrumbs />);
    expect(getByTestId('breadcrumbs')).to.exist;
  });
});
