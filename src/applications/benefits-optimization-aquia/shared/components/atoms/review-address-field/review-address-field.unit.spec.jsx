import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { ReviewAddressField } from './review-address-field';

describe('ReviewAddressField', () => {
  describe('Complete address', () => {
    it('should render complete US address', () => {
      const address = {
        street: '123 Main St',
        street2: 'Apt 4',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
      };

      const { container } = render(<ReviewAddressField value={address} />);

      expect(container.textContent).to.include('123 Main St');
      expect(container.textContent).to.include('Apt 4');
      expect(container.textContent).to.include('Springfield, IL 62701');
    });

    it('should render address with street3', () => {
      const address = {
        street: '123 Main St',
        street2: 'Building A',
        street3: 'Suite 100',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
      };

      const { container } = render(<ReviewAddressField value={address} />);

      expect(container.textContent).to.include('123 Main St');
      expect(container.textContent).to.include('Building A');
      expect(container.textContent).to.include('Suite 100');
    });
  });

  describe('Partial address', () => {
    it('should render address without street2', () => {
      const address = {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
      };

      const { container } = render(<ReviewAddressField value={address} />);

      expect(container.textContent).to.include('123 Main St');
      expect(container.textContent).to.include('Springfield, IL 62701');
    });

    it('should render address with only street and city', () => {
      const address = {
        street: '123 Main St',
        city: 'Springfield',
      };

      const { container } = render(<ReviewAddressField value={address} />);

      expect(container.textContent).to.include('123 Main St');
    });
  });

  describe('International address', () => {
    it('should render international address with country', () => {
      const address = {
        street: '10 Downing Street',
        city: 'London',
        postalCode: 'SW1A 2AA',
        country: 'United Kingdom',
      };

      const { container } = render(<ReviewAddressField value={address} />);

      expect(container.textContent).to.include('10 Downing Street');
      expect(container.textContent).to.include('United Kingdom');
    });

    it('should not render USA as country', () => {
      const address = {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
        country: 'USA',
      };

      const { container } = render(<ReviewAddressField value={address} />);
      const addressBlock = container.querySelector('.va-address-block');

      expect(addressBlock.textContent).to.not.contain('USA');
    });
  });

  describe('Military address', () => {
    it('should render military address', () => {
      const address = {
        militaryAddress: 'PSC 123 Box 456',
        city: 'APO',
        state: 'AE',
        postalCode: '09123',
      };

      const { container } = render(<ReviewAddressField value={address} />);

      expect(container.textContent).to.include('PSC 123 Box 456');
      expect(container.textContent).to.include('APO, AE 09123');
    });
  });

  describe('Label', () => {
    it('should use default label "Address"', () => {
      const address = {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
      };

      const { container } = render(<ReviewAddressField value={address} />);

      expect(container.textContent).to.include('Address');
    });

    it('should use custom label', () => {
      const address = {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
      };

      const { container } = render(
        <ReviewAddressField label="Mailing Address" value={address} />,
      );

      expect(container.textContent).to.include('Mailing Address');
    });
  });

  describe('Empty values', () => {
    it('should render empty text when value is null', () => {
      const { container } = render(<ReviewAddressField value={null} />);

      expect(container.textContent).to.include('Not provided');
    });

    it('should render empty text when value is undefined', () => {
      const { container } = render(<ReviewAddressField value={undefined} />);

      expect(container.textContent).to.include('Not provided');
    });

    it('should render empty text when address object is empty', () => {
      const { container } = render(<ReviewAddressField value={{}} />);

      expect(container.textContent).to.include('Not provided');
    });

    it('should render custom empty text', () => {
      const { container } = render(
        <ReviewAddressField value={null} emptyText="No address provided" />,
      );

      expect(container.textContent).to.include('No address provided');
    });

    it('should hide when value is empty and hideWhenEmpty is true', () => {
      const { container } = render(
        <ReviewAddressField value={null} hideWhenEmpty />,
      );

      expect(container.querySelector('.review-row')).to.not.exist;
    });
  });

  describe('Structure', () => {
    it('should have proper review-row structure', () => {
      const address = {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
      };

      const { container } = render(<ReviewAddressField value={address} />);

      expect(container.querySelector('.review-row')).to.exist;
      expect(container.querySelector('dt')).to.exist;
      expect(container.querySelector('dd')).to.exist;
    });

    it('should use va-address-block class', () => {
      const address = {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
      };

      const { container } = render(<ReviewAddressField value={address} />);

      expect(container.querySelector('.va-address-block')).to.exist;
    });
  });
});
