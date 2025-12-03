import React from 'react';
import { expect } from 'chai';
import { render, within } from '@testing-library/react';

import ServiceUnavailableAlert from '../../components/ServiceUnavailableAlert';

describe('<ServiceUnavailableAlert>', () => {
  it('should render va-alert with warning status, heading, and body text', () => {
    const { container } = render(
      <ServiceUnavailableAlert services={['claims']} />,
    );

    const alert = container.querySelector('va-alert');
    expect(alert).to.be.visible;
    expect(alert).to.have.attr('status', 'warning');

    // Test heading
    const heading = container.querySelector('h3');
    expect(heading).to.be.visible;
    expect(heading.textContent).to.equal('Claim status is unavailable');

    // Test static text once
    expect(within(container).getByText(/Check back again in an hour/i)).to.be
      .visible;
  });

  context('when services contains only "claims"', () => {
    it('should render correct body text', () => {
      const { container } = render(
        <ServiceUnavailableAlert services={['claims']} />,
      );

      expect(
        within(container).getByText(
          /VA.gov is having trouble loading claims information/i,
        ),
      ).to.be.visible;

      expect(
        within(container).getByText(
          /Note: You are still able to review appeals information/i,
        ),
      ).to.be.visible;
    });
  });

  context('when services contains only "appeals"', () => {
    it('should render correct body text', () => {
      const { container } = render(
        <ServiceUnavailableAlert services={['appeals']} />,
      );

      expect(
        within(container).getByText(
          /VA.gov is having trouble loading appeals information/i,
        ),
      ).to.be.visible;

      expect(
        within(container).getByText(
          /Note: You are still able to review claims information/i,
        ),
      ).to.be.visible;
    });
  });

  context('when services contains multiple services', () => {
    it('should render correct body text with proper grammar', () => {
      const { container } = render(
        <ServiceUnavailableAlert services={['claims', 'appeals']} />,
      );

      expect(
        within(container).getByText(
          /VA.gov is having trouble loading claims and appeals information/i,
        ),
      ).to.be.visible;

      expect(container.textContent).to.not.include('Note:');
    });
  });

  context('headerLevel prop', () => {
    it('should render custom heading level when provided', () => {
      const { container } = render(
        <ServiceUnavailableAlert services={['claims']} headerLevel={2} />,
      );

      const heading = container.querySelector('h2');
      expect(heading.textContent).to.equal('Claim status is unavailable');
    });
  });

  context('edge cases', () => {
    it('should return null when services is empty array', () => {
      const { container } = render(<ServiceUnavailableAlert services={[]} />);

      const alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });

    it('should return null when services is undefined', () => {
      const { container } = render(
        <ServiceUnavailableAlert services={undefined} />,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });
  });
});
