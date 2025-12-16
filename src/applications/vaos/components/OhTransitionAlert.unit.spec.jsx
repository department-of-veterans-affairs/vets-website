import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import OhTransitionAlert from './OhTransitionAlert';

describe('VAOS OhTransitionAlert component', () => {
  it('renders the expandable alert with correct trigger text', () => {
    const { getByTestId } = render(<OhTransitionAlert />);

    const alert = getByTestId('oh-transition-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('info');
    expect(alert.getAttribute('trigger')).to.equal(
      'You can now manage most of your appointments for all VA facilities right here',
    );
  });

  it('renders the alert body content', () => {
    const { getByText } = render(<OhTransitionAlert />);

    expect(
      getByText(
        /We've brought all your VA health care data together so you can manage your care in one place/i,
      ),
    ).to.exist;
    expect(getByText(/Still want to use My VA Health for now\?/i)).to.exist;
  });

  it('renders the Go to My VA Health link', () => {
    const { container } = render(<OhTransitionAlert />);

    const link = container.querySelector('va-link-action');
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal('Go to My VA Health');
    expect(link.getAttribute('type')).to.equal('secondary');
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <OhTransitionAlert className="custom-class" />,
    );

    const wrapper = container.querySelector('.custom-class');
    expect(wrapper).to.exist;
  });
});
