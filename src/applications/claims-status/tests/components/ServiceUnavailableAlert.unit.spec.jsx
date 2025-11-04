import React from 'react';
import { expect } from 'chai';
import { render, within } from '@testing-library/react';

import ServiceUnavailableAlert from '../../components/ServiceUnavailableAlert';

describe('<ServiceUnavailableAlert>', () => {
  it('should render va-alert with warning status and slim attribute', () => {
    const { container } = render(
      <ServiceUnavailableAlert services={['claims']} />,
    );

    const alert = container.querySelector('va-alert');
    expect(alert).to.be.visible;
    expect(alert).to.have.attr('status', 'warning');
    expect(alert).to.have.attr('slim', 'true');

    // Test static text once
    expect(within(container).getByText(/Refresh this page or try again later/i))
      .to.be.visible;
  });

  context('when services contains only "claims"', () => {
    it('should render correct body text', () => {
      const { container } = render(
        <ServiceUnavailableAlert services={['claims']} />,
      );

      expect(
        within(container).getByText(/We can't show your claims right now/i),
      ).to.be.visible;
    });
  });

  context('when services contains only "appeals"', () => {
    it('should render correct body text', () => {
      const { container } = render(
        <ServiceUnavailableAlert services={['appeals']} />,
      );

      expect(
        within(container).getByText(/We can't show your appeals right now/i),
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
          /We can't show your claims and appeals right now/i,
        ),
      ).to.be.visible;
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
