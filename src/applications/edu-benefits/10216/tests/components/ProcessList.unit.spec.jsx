import { render } from '@testing-library/react';
import React from 'react';
import { expect } from 'chai';
import ProcessList from '../../components/ProcessList';

describe('ProcessList', () => {
  it('renders without issues', () => {
    const { container } = render(<ProcessList />);
    expect(container).to.exist;
  });
  it('renders with a download and save both forms header', () => {
    const { container } = render(<ProcessList isAccredited />);
    expect(container.querySelector('va-link')).to.exist;
  });
});
