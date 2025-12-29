import React from 'react';
import { expect } from 'chai';
import { render, within } from '@testing-library/react';

import ServiceUnavailableAlert from '../../components/ServiceUnavailableAlert';

describe('<ServiceUnavailableAlert>', () => {
  const bodyText =
    "We're sorry. There's a problem with our system. Refresh this page or try again later.";

  it('should render va-alert with warning status', () => {
    const { container } = render(
      <ServiceUnavailableAlert services={['claims']} />,
    );

    const alert = container.querySelector('va-alert');
    expect(alert).to.be.visible;
    expect(alert).to.have.attr('status', 'warning');
  });

  context('plural form (default)', () => {
    it('should render correct heading for claims only', () => {
      const { container } = render(
        <ServiceUnavailableAlert services={['claims']} />,
      );

      const heading = container.querySelector('h3');
      expect(heading).to.be.visible;
      expect(heading.textContent).to.equal(
        "We can't access some of your claims right now",
      );
    });

    it('should render correct heading for appeals only', () => {
      const { container } = render(
        <ServiceUnavailableAlert services={['appeals']} />,
      );

      const heading = container.querySelector('h3');
      expect(heading.textContent).to.equal(
        "We can't access some of your appeals right now",
      );
    });

    it('should render correct heading for both claims and appeals', () => {
      const { container } = render(
        <ServiceUnavailableAlert services={['claims', 'appeals']} />,
      );

      const heading = container.querySelector('h3');
      expect(heading.textContent).to.equal(
        "We can't access some of your claims or appeals right now",
      );
    });

    it('should render correct body text', () => {
      const { container } = render(
        <ServiceUnavailableAlert services={['claims']} />,
      );

      expect(within(container).getByText(bodyText)).to.be.visible;
    });
  });

  context('singular form (useSingular=true)', () => {
    it('should render singular heading for claim', () => {
      const { container } = render(
        <ServiceUnavailableAlert services={['claims']} useSingular />,
      );

      const heading = container.querySelector('h3');
      expect(heading.textContent).to.equal(
        "We can't access your claim right now",
      );
    });

    it('should render singular heading for appeal', () => {
      const { container } = render(
        <ServiceUnavailableAlert services={['appeals']} useSingular />,
      );

      const heading = container.querySelector('h3');
      expect(heading.textContent).to.equal(
        "We can't access your appeal right now",
      );
    });

    it('should render correct body text', () => {
      const { container } = render(
        <ServiceUnavailableAlert services={['claims']} useSingular />,
      );

      expect(within(container).getByText(bodyText)).to.be.visible;
    });
  });

  context('headerLevel prop', () => {
    it('should render custom heading level when provided', () => {
      const { container } = render(
        <ServiceUnavailableAlert services={['claims']} headerLevel={2} />,
      );

      const heading = container.querySelector('h2');
      expect(heading.textContent).to.equal(
        "We can't access some of your claims right now",
      );
    });

    it('should render h2 for singular form with headerLevel={2}', () => {
      const { container } = render(
        <ServiceUnavailableAlert
          services={['claims']}
          headerLevel={2}
          useSingular
        />,
      );

      const heading = container.querySelector('h2');
      expect(heading.textContent).to.equal(
        "We can't access your claim right now",
      );
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
