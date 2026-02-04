import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ErrorText from '../../../components/ErrorText';

describe('Survivors Benefits <ErrorText />', () => {
  it('renders paragraph with expected text', () => {
    const { container } = render(<ErrorText />);
    const paragraph = container.querySelector('p');
    expect(paragraph).to.exist;
    expect(paragraph.textContent).to.include(
      'If it still doesn’t work, please',
    );
  });

  it('renders CallVBACenter span element', () => {
    const { container } = render(<ErrorText />);
    const span = container.querySelector('span');
    expect(span).to.exist;
  });

  it('contains only one paragraph', () => {
    const { container } = render(<ErrorText />);
    expect(container.querySelectorAll('p').length).to.equal(1);
  });
});
