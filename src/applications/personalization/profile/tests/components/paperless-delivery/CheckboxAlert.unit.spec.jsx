import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { expect } from 'chai';
import { CheckboxAlert } from '../../../components/paperless-delivery/CheckboxAlert';

describe('CheckboxAlert', () => {
  afterEach(() => {
    cleanup();
  });

  it('should not render', () => {
    const { container } = render(<CheckboxAlert />);
    const alert = container.querySelector('va-alert');
    expect(alert).to.not.exist;
  });

  it('should render error alert', () => {
    const { container, getByText } = render(<CheckboxAlert error />);
    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(getByText(/We can’t update your information right now/)).to.exist;
  });

  it('should render success alert', () => {
    const { container, getByText } = render(<CheckboxAlert success />);
    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(getByText(/Update saved/)).to.exist;
  });
});
