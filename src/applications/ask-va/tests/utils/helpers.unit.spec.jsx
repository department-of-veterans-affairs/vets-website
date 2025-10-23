import { render } from '@testing-library/react';
import { expect } from 'chai';
import {
  ADDRESS_TYPES,
  clockIcon,
  folderIcon,
  formatAddress,
  getFileSize,
  setFocus,
  starIcon,
  successIcon,
} from '../../utils/helpers';

describe('Utility Functions', () => {
  describe('formatAddress', () => {
    it('should handle undefined address', () => {
      const result = formatAddress(undefined);
      expect(result).to.deep.equal({
        addressStreet: 'undefined  ',
        cityStateZip: 'undefined, undefined undefined',
        addressCountry: '',
      });
    });

    it('should format domestic address with street', () => {
      const address = {
        addressType: ADDRESS_TYPES.domestic,
        street: '123 Main St',
        street2: 'Apt 4B',
        city: 'Springfield',
        stateCode: 'IL',
        zipCode: '62701',
      };
      const result = formatAddress(address);
      expect(result).to.deep.equal({
        addressStreet: '123 Main St Apt 4B',
        cityStateZip: 'Springfield, IL 62701',
        addressCountry: '',
      });
    });

    it('should format domestic address with address lines', () => {
      const address = {
        addressType: ADDRESS_TYPES.domestic,
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4B',
        addressLine3: 'Building C',
        city: 'Springfield',
        stateCode: 'IL',
        zipCode: '62701',
      };
      const result = formatAddress(address);
      expect(result).to.deep.equal({
        addressStreet: '123 Main St Apt 4B Building C',
        cityStateZip: 'Springfield, IL 62701',
        addressCountry: '',
      });
    });

    it('should format international address', () => {
      const address = {
        addressType: ADDRESS_TYPES.international,
        street: '123 High Street',
        city: 'London',
        state: 'Greater London',
        postalCode: 'SW1A 1AA',
        country: 'GBR',
      };
      const result = formatAddress(address);
      expect(result.addressStreet).to.equal('123 High Street ');
      expect(result.cityStateZip).to.equal('London, Greater London SW1A 1AA');
      // Note: addressCountry test omitted as it depends on countries.json content
    });

    it('should format military address', () => {
      const address = {
        addressType: ADDRESS_TYPES.military,
        street: 'Unit 2050 Box 4190',
        militaryAddress: {
          militaryPostOffice: 'APO',
          militaryState: 'AP',
        },
        zipCode: '96278',
      };
      const result = formatAddress(address);
      expect(result).to.deep.equal({
        addressStreet: 'Unit 2050 Box 4190 ',
        cityStateZip: 'APO, AP 96278',
        addressCountry: '',
      });
    });

    it('should handle missing city and state', () => {
      const address = {
        addressType: ADDRESS_TYPES.domestic,
        street: '123 Main St',
      };
      const result = formatAddress(address);
      expect(result).to.deep.equal({
        addressStreet: '123 Main St ',
        cityStateZip: undefined,
        addressCountry: '',
      });
    });

    it('should handle missing street and address lines', () => {
      const address = {
        addressType: ADDRESS_TYPES.domestic,
        city: 'Springfield',
        stateCode: 'IL',
      };
      const result = formatAddress(address);
      expect(result).to.deep.equal({
        addressStreet: 'undefined  ',
        cityStateZip: 'Springfield, IL',
        addressCountry: '',
      });
    });

    it('should handle city without state', () => {
      const address = {
        addressType: ADDRESS_TYPES.domestic,
        city: 'Springfield',
      };
      const result = formatAddress(address);
      expect(result).to.deep.equal({
        addressStreet: 'undefined  ',
        cityStateZip: 'Springfield',
        addressCountry: '',
      });
    });

    it('should handle state without city', () => {
      const address = {
        addressType: ADDRESS_TYPES.domestic,
        stateCode: 'IL',
      };
      const result = formatAddress(address);
      expect(result).to.deep.equal({
        addressStreet: 'undefined  ',
        cityStateZip: 'undefinedIL',
        addressCountry: '',
      });
    });
  });

  describe('getFileSize', () => {
    it('should return file size in bytes', () => {
      expect(getFileSize(500)).to.equal('500 B');
    });

    it('should return file size in kilobytes', () => {
      expect(getFileSize(1500)).to.equal('1 KB');
    });

    it('should return file size in megabytes', () => {
      expect(getFileSize(1500000)).to.equal('1.5 MB');
    });

    it('should handle edge cases between units', () => {
      expect(getFileSize(999)).to.equal('999 B');
      expect(getFileSize(1000)).to.equal('1 KB');
      expect(getFileSize(999999)).to.equal('999 KB');
      expect(getFileSize(1000000)).to.equal('1.0 MB');
    });
  });

  describe('setFocus', () => {
    it('should handle string selector', () => {
      expect(() => setFocus('#test-element')).to.not.throw();
    });

    it('should handle element with tabIndex', () => {
      const element = document.createElement('div');
      expect(() => setFocus(element, true)).to.not.throw();
    });

    it('should handle element without tabIndex', () => {
      const element = document.createElement('div');
      expect(() => setFocus(element, false)).to.not.throw();
    });

    it('should handle non-existent selector', () => {
      expect(() => setFocus('#non-existent')).to.not.throw();
    });
  });

  describe('Icons', () => {
    it('should render successIcon correctly', () => {
      const { container } = render(successIcon);
      expect(container.querySelector('.vads-u-color--green')).to.exist;
      expect(container.querySelector('va-icon[icon="check_circle"]')).to.exist;
    });

    it('should render starIcon correctly', () => {
      const { container } = render(starIcon);
      expect(container.querySelector('.vads-u-color--primary')).to.exist;
      expect(container.querySelector('va-icon[icon="star"]')).to.exist;
    });

    it('should render clockIcon correctly', () => {
      const { container } = render(clockIcon);
      expect(container.querySelector('.vads-u-color--grey')).to.exist;
      expect(container.querySelector('va-icon[icon="schedule"]')).to.exist;
    });

    it('should render folderIcon correctly', () => {
      const { container } = render(folderIcon);
      expect(container.querySelector('.vads-u-color--grey')).to.exist;
      expect(container.querySelector('va-icon[icon="folder"]')).to.exist;
    });
  });
});
