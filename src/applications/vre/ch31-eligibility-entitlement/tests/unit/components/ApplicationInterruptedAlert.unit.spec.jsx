import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import ApplicationInterruptedAlert from '../../../components/ApplicationInterruptedAlert';

describe('ApplicationInterruptedAlert', () => {
  it('renders va-alert with error status and visible', () => {
    const { container } = render(<ApplicationInterruptedAlert />);

    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('error');
    expect(alert.hasAttribute('visible')).to.be.true;
    expect(alert.getAttribute('close-btn-aria-label')).to.equal(
      'Close notification',
    );
  });

  it('renders headline inside va-alert', () => {
    const { container } = render(<ApplicationInterruptedAlert />);

    const headline = container.querySelector('va-alert h3[slot="headline"]');
    expect(headline).to.exist;
    expect(headline.textContent).to.match(
      /sorry, your vr&e chapter 31 benefits have been interrupted/i,
    );
  });

  it('renders explanatory text and default reason fallback', () => {
    const { getByText } = render(<ApplicationInterruptedAlert />);

    expect(
      getByText(
        /your vr&e chapter 31 benefits have been interrupted for the following reasons:/i,
      ),
    ).to.exist;

    expect(getByText(/no reason provided\./i)).to.exist;
  });

  it('renders provided interrupted reason when passed', () => {
    const reason = 'You did not complete required counseling sessions.';
    const { getByText, queryByText } = render(
      <ApplicationInterruptedAlert interruptedReason={reason} />,
    );

    expect(getByText(reason)).to.exist;
    expect(queryByText(/no reason provided\./i)).to.be.null;
  });

  it('renders eFolder link inside the alert', () => {
    const { container, getByText } = render(<ApplicationInterruptedAlert />);

    const link = container.querySelector('va-link-action');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal('https://va.gov');
    expect(link.getAttribute('type')).to.equal('primary');

    // Text is rendered via attribute on web component; ensure visible text node exists
    expect(getByText(/efolder/i)).to.exist;
  });

  it('applies layout classes on outer container', () => {
    const { container } = render(<ApplicationInterruptedAlert />);

    const wrapper = container.querySelector('div');
    expect(wrapper).to.exist;
    expect(wrapper.classList.contains('usa-width-two-thirds')).to.be.true;
    expect(wrapper.classList.contains('vads-u-margin-y--3')).to.be.true;
  });
});
