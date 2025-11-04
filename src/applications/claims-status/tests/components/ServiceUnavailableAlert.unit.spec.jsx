import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ServiceUnavailableAlert from '../../components/ServiceUnavailableAlert';

describe('<ServiceUnavailableAlert>', () => {
  context('when services contains only "claims"', () => {
    it('should render va-alert with warning status', () => {
      const { container } = render(
        <ServiceUnavailableAlert services={['claims']} />,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert).to.have.attr('status', 'warning');
    });

    it('should render correct body text with proper grammar', () => {
      const { container } = render(
        <ServiceUnavailableAlert services={['claims']} />,
      );

      const paragraph = container.querySelector('p');
      expect(paragraph.textContent).to.include('We can');
      expect(paragraph.textContent).to.include('show your claims right now');
      expect(paragraph.textContent).to.include(
        'Refresh this page or try again later',
      );
    });
  });

  context('when services contains only "appeals"', () => {
    it('should render va-alert with warning status', () => {
      const { container } = render(
        <ServiceUnavailableAlert services={['appeals']} />,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert).to.have.attr('status', 'warning');
    });

    it('should render correct body text with proper grammar', () => {
      const { container } = render(
        <ServiceUnavailableAlert services={['appeals']} />,
      );

      const paragraph = container.querySelector('p');
      expect(paragraph.textContent).to.include('We can');
      expect(paragraph.textContent).to.include('show your appeals right now');
      expect(paragraph.textContent).to.include(
        'Refresh this page or try again later',
      );
    });
  });

  context('when services contains multiple services', () => {
    it('should render va-alert with warning status for claims and appeals', () => {
      const { container } = render(
        <ServiceUnavailableAlert services={['claims', 'appeals']} />,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert).to.have.attr('status', 'warning');
    });

    it('should render correct body text with proper grammar', () => {
      const { container } = render(
        <ServiceUnavailableAlert services={['claims', 'appeals']} />,
      );

      const paragraph = container.querySelector('p');
      expect(paragraph.textContent).to.include('We can');
      expect(paragraph.textContent).to.include(
        'show your claims and appeals right now',
      );
      expect(paragraph.textContent).to.include(
        'Refresh this page or try again later',
      );
    });
  });

  context('edge cases', () => {
    it('should return null when services is empty array', () => {
      const { container } = render(<ServiceUnavailableAlert services={[]} />);

      const alert = container.querySelector('va-alert');
      expect(alert).not.to.exist;
    });

    it('should return null when services is undefined', () => {
      const { container } = render(
        <ServiceUnavailableAlert services={undefined} />,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).not.to.exist;
    });
  });
});
