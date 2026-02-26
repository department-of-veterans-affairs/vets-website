import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import App from '../containers/App';

describe('App Component', () => {
  it('renders the id from params without store', async () => {
    const mockParams = { id: 'test-123' };

    const { container } = render(<App params={mockParams} />);

    expect(container.textContent).to.include('test-123');
  });

  it('renders with different id values', async () => {
    const mockParams = { id: 'another-id' };

    const { container } = render(<App params={mockParams} />);

    expect(container.textContent).to.include('another-id');
  });
});
