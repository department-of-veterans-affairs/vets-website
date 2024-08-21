import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import ListItemView from '../../../components/ListItemView';

describe('ListItemView Component', () => {
  it('renders without crashing', async () => {
    const { container } = render(<ListItemView title="Test title" />);
    await waitFor(() => {
      expect($('h3', container)).to.exist;
    });
  });

  it('displays the correct title', () => {
    const title = 'Software Engineer';
    const { container } = render(<ListItemView title={title} />);
    expect($('h3', container).textContent).to.eql(title);
  });

  it('handles missing title gracefully', () => {
    const { container } = render(<ListItemView />);
    expect($('h3', container).textContent).to.eql('');
  });
});
