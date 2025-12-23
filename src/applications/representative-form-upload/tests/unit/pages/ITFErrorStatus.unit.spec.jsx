import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ITF403Error from '../../../components/ITF403Error';
import ITF500Error from '../../../components/ITF500Error';

describe('Is a 403 error status', () => {
  const subject = () => render(<ITF403Error />);

  it.skip('renders successfully', () => {
    // skipping to support node 22 upgrade

    const { container } = subject();
    expect(container).to.exist;
  });
});

describe('500 error status', () => {
  const subject = () => render(<ITF500Error />);

  it.skip('renders successfully', () => {
    // skipping to support node 22 upgrade

    const { container } = subject();
    expect(container).to.exist;
  });
});
