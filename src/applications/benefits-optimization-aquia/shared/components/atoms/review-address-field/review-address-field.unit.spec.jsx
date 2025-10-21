import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { ReviewAddressField } from './review-address-field';

describe('ReviewAddressField', () => {
  describe('Complete address', () => {
    it('should render complete US address', () => {
      const address = {
        street: 'Great Temple, Massassi Station',
        street2: 'Briefing Room 4',
        city: 'Yavin 4',
        state: 'NC',
        postalCode: '00004',
      };

      const { container } = render(<ReviewAddressField value={address} />);

      expect(container.textContent).to.include(
        'Great Temple, Massassi Station',
      );
      expect(container.textContent).to.include('Briefing Room 4');
      expect(container.textContent).to.include('Yavin 4, NC 00004');
    });

    it('should render address with street3', () => {
      const address = {
        street: 'Echo Base Command Center',
        street2: 'North Passage',
        street3: 'Ice Cavern 7',
        city: 'Hoth',
        state: 'AK',
        postalCode: '99501',
      };

      const { container } = render(<ReviewAddressField value={address} />);

      expect(container.textContent).to.include('Echo Base Command Center');
      expect(container.textContent).to.include('North Passage');
      expect(container.textContent).to.include('Ice Cavern 7');
    });
  });

  describe('Partial address', () => {
    it('should render address without street2', () => {
      const address = {
        street: 'Bright Tree Village',
        city: 'Endor',
        state: 'CA',
        postalCode: '90210',
      };

      const { container } = render(<ReviewAddressField value={address} />);

      expect(container.textContent).to.include('Bright Tree Village');
      expect(container.textContent).to.include('Endor, CA 90210');
    });

    it('should render address with only street and city', () => {
      const address = {
        street: 'Shipyard District, Home One',
        city: 'Mon Calamari',
      };

      const { container } = render(<ReviewAddressField value={address} />);

      expect(container.textContent).to.include('Shipyard District, Home One');
    });
  });

  describe('International address', () => {
    it('should render international address with country', () => {
      const address = {
        street: 'Rebel Outpost Delta',
        city: 'Dantooine',
        postalCode: 'DA-001',
        country: 'Outer Rim Territories',
      };

      const { container } = render(<ReviewAddressField value={address} />);

      expect(container.textContent).to.include('Rebel Outpost Delta');
      expect(container.textContent).to.include('Outer Rim Territories');
    });

    it('should not render USA as country', () => {
      const address = {
        street: 'Great Temple, Massassi Station',
        city: 'Yavin 4',
        state: 'NC',
        postalCode: '00004',
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
        militaryAddress: 'Rogue Squadron Hangar Bay',
        city: 'APO',
        state: 'AE',
        postalCode: '09004',
      };

      const { container } = render(<ReviewAddressField value={address} />);

      expect(container.textContent).to.include('Rogue Squadron Hangar Bay');
      expect(container.textContent).to.include('APO, AE 09004');
    });
  });

  describe('Label', () => {
    it('should use default label "Address"', () => {
      const address = {
        street: 'Great Temple, Massassi Station',
        city: 'Yavin 4',
        state: 'NC',
        postalCode: '00004',
      };

      const { container } = render(<ReviewAddressField value={address} />);

      expect(container.textContent).to.include('Address');
    });

    it('should use custom label', () => {
      const address = {
        street: 'Echo Base Command Center',
        city: 'Hoth',
        state: 'AK',
        postalCode: '99501',
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
        street: 'Bright Tree Village',
        city: 'Endor',
        state: 'CA',
        postalCode: '90210',
      };

      const { container } = render(<ReviewAddressField value={address} />);

      expect(container.querySelector('.review-row')).to.exist;
      expect(container.querySelector('dt')).to.exist;
      expect(container.querySelector('dd')).to.exist;
    });

    it('should use va-address-block class', () => {
      const address = {
        street: 'Shipyard District, Home One',
        city: 'Mon Calamari',
        state: 'FL',
        postalCode: '33101',
      };

      const { container } = render(<ReviewAddressField value={address} />);

      expect(container.querySelector('.va-address-block')).to.exist;
    });
  });
});
