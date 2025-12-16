import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import OhTransitionAlert from '../../components/OhTransitionAlert';

describe('Landing Page OhTransitionAlert component', () => {
  it('renders the expandable alert with correct trigger text', () => {
    const { getByTestId } = render(<OhTransitionAlert />);

    const alert = getByTestId('oh-transition-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('info');
    expect(alert.getAttribute('trigger')).to.equal(
      'You can now manage your health care for all VA facilities right here',
    );
  });

  it('renders the alert body content', () => {
    const { getByTestId, getByText } = render(<OhTransitionAlert />);

    const content = getByTestId('oh-transition-alert-content');
    expect(content).to.exist;

    expect(
      getByText(
        /We've brought all your VA health care data together so you can manage your care in one place/i,
      ),
    ).to.exist;
    expect(getByText(/Still want to use My VA Health for now\?/i)).to.exist;
  });

  it('renders the Go to My VA Health link as VaLinkAction', () => {
    const { getByTestId } = render(<OhTransitionAlert />);

    const link = getByTestId('oh-transition-alert-link');
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal('Go to My VA Health');
    expect(link.getAttribute('type')).to.equal('secondary');
  });
});
