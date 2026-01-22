import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import NeedHelp from '../../components/NeedHelp';

// jsdom 20+ provides native customElements support, so no mocking needed.
// VA web components render as custom elements without explicit registration.

describe('NeedHelp', () => {
  it('renders the component', () => {
    const { container } = render(<NeedHelp />);
    expect(container).to.exist;
  });
});
