import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import PermissionError from '../../../components/PermissionError';

describe('Is a 403 error status', () => {
  const subject = () => render(<PermissionError />);

  it.skip('renders successfully', () => {
    // skipping to support node 22 upgrade

    const { container } = subject();
    expect(container).to.exist;
  });
});
