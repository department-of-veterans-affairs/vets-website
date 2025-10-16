import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import {
  AssetInformationAlert,
  AssetsInformation,
} from '../../../components/FormAlerts';

describe('FormAlerts', () => {
  describe('AssetInformationAlert', () => {
    it('should render without crashing', () => {
      const { container } = render(<AssetInformationAlert />);
      expect(container).to.exist;
    });

    it('should display the asset information trigger', () => {
      const { container } = render(<AssetInformationAlert />);

      const additionalInfo = container.querySelector('va-additional-info');
      expect(additionalInfo).to.exist;
      expect(additionalInfo.getAttribute('trigger')).to.equal(
        'How we define assets',
      );
    });

    it('should contain asset definition text', () => {
      const { container } = render(<AssetInformationAlert />);

      expect(container.textContent).to.include(
        'Assets are all the money and property',
      );
      expect(container.textContent).to.include(
        'primary residence or personal belongings',
      );
    });
  });

  describe('AssetsInformation', () => {
    it('should render without crashing', () => {
      const { container } = render(<AssetsInformation />);
      expect(container).to.exist;
    });

    it('should display accordion structure', () => {
      const { container } = render(<AssetsInformation />);

      const accordion = container.querySelector('va-accordion');
      expect(accordion).to.exist;

      const accordionItems = container.querySelectorAll('va-accordion-item');
      expect(accordionItems.length).to.equal(2);
    });

    it('should have correct accordion headers', () => {
      const { container } = render(<AssetsInformation />);

      const accordionItems = container.querySelectorAll('va-accordion-item');
      expect(accordionItems[0].getAttribute('header')).to.equal(
        'What we consider an asset',
      );
      expect(accordionItems[1].getAttribute('header')).to.equal(
        'Who we consider a dependent',
      );
    });

    it('should contain asset examples', () => {
      const { container } = render(<AssetsInformation />);

      expect(container.textContent).to.include('stocks and bonds');
      expect(container.textContent).to.include('Antique furniture');
      expect(container.textContent).to.include('Boats');
    });

    it('should contain excluded items information', () => {
      const { container } = render(<AssetsInformation />);

      expect(container.textContent).to.include('Your primary residence');
      expect(container.textContent).to.include('Your car');
      expect(container.textContent).to.include('Basic home items');
    });

    it('should contain dependent definition', () => {
      const { container } = render(<AssetsInformation />);

      expect(container.textContent).to.include('A dependent is:');
      expect(container.textContent).to.include('A spouse');
    });
  });
});
