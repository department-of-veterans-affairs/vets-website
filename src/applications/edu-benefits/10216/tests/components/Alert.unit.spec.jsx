import { render } from '@testing-library/react';
import React from 'react';
import { expect } from 'chai';
import Alert from '../../components/Alert';

describe('Alert', () => {
  it('renders without issues', () => {
    const { container } = render(<Alert />);
    expect(container).to.exist;
    expect(container.querySelector('va-alert')).to.exist;
  });
  it('renders with a warning status', () => {
    const { container } = render(<Alert isAccredited={false} />);
    expect(container.querySelector('va-alert').getAttribute('status')).to.equal(
      'warning',
    );
  });
  it('renders with an info status', () => {
    const { container } = render(<Alert isAccredited />);
    expect(container.querySelector('va-alert').getAttribute('status')).to.equal(
      'info',
    );
  });
  it('renders with the correct headline', () => {
    const { container } = render(<Alert isAccredited />);
    expect(container.querySelector('h2').textContent).to.equal(
      'Complete all submission steps',
    );
  });
  it('renders with the correct alert message', () => {
    const { container } = render(<Alert isAccredited />);
    expect(container.querySelector('p').textContent).to.equal(
      'This form requires additional steps for successful submission. Follow the instructions below carefully to ensure your form is submitted correctly.',
    );
  });
});
