import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import {
  facilityCodeUIValidation,
  getCardDescription,
  getItemName,
  isPOEEligible,
} from '../helpers';

describe('10275 Helpers', () => {
  describe('#getCardDescription', () => {
    it('should return the correct card description', () => {
      const card = {
        fullName: {
          first: 'John',
          middle: '',
          last: 'Doe',
        },
        email: 'john.doe@example.com',
      };
      const description = getCardDescription(card);
      const { getByTestId } = render(description);

      expect(getByTestId('card-name').textContent).to.equal('John Doe');
      expect(getByTestId('card-email').textContent).to.equal(
        'john.doe@example.com',
      );
    });

    it('should return full name when fullName is an object', () => {
      const card = {
        fullName: {
          first: 'John',
          last: 'Doe',
        },
      };
      const description = getCardDescription(card);
      const { getByTestId } = render(description);

      expect(getByTestId('card-name').textContent).to.equal('John Doe');
    });

    it('should render institution address when institutionAddress is present', () => {
      const card = {
        institutionAddress: {
          street: '123 Main St',
          city: 'some city',
          state: 'CA',
          postalCode: '12345',
        },
      };
      const description = getCardDescription(card);
      const { getByTestId } = render(description);

      expect(getByTestId('card-address').textContent).to.equal(
        '123 Main Stsome city, CA 12345',
      );
    });

    it('should retun null when no institution address is present', () => {
      const card = {
        institutionAddress: null,
      };
      const description = getCardDescription(card);
      const { queryByTestId } = render(description);

      expect(queryByTestId('card-address')).to.not.exist;
    });

    it('should handle missing city in address', () => {
      const card = {
        institutionAddress: {
          state: 'CA',
          postalCode: '12345',
        },
      };
      const description = getCardDescription(card);
      const { getByTestId } = render(description);

      expect(getByTestId('card-address').textContent).to.equal('CA 12345');
    });

    it('should handle missing state in address', () => {
      const card = {
        institutionAddress: {
          city: 'some city',
          postalCode: '12345',
        },
      };
      const description = getCardDescription(card);
      const { getByTestId } = render(description);

      expect(getByTestId('card-address').textContent).to.equal(
        'some city,  12345',
      );
    });

    it('should handle missing postalCode in address', () => {
      const card = {
        institutionAddress: {
          city: 'some city',
          state: 'CA',
        },
      };
      const description = getCardDescription(card);
      const { getByTestId } = render(description);

      expect(getByTestId('card-address').textContent).to.equal('some city, CA');
    });

    it('should return null when no item is present', () => {
      const description = getCardDescription(null);
      const { queryByTestId } = render(description);

      expect(queryByTestId('card-address')).to.not.exist;
    });
  });

  describe('#getItemName', () => {
    it('should return the correct item name', () => {
      const item = {
        institutionName: 'some institution',
      };
      const name = getItemName(item);

      expect(name).to.equal('some institution');
    });

    it('should return Location when no institution name is present', () => {
      const item = {
        institutionName: null,
      };
      const name = getItemName(item);

      expect(name).to.equal('Location');
    });

    it('should return null when no item is present', () => {
      const name = getItemName(null);
      expect(name).to.be.null;
    });
  });

  describe('#facilityCodeUIValidation', () => {
    it('should return a unique error message for duplicate facility codes', () => {
      const addErrorSpy = sinon.spy();
      const errors = { addError: addErrorSpy };
      const fieldData = '12345678';
      const formData = {
        additionalLocations: [
          { facilityCode: '12345678' },
          { facilityCode: '12345678' },
        ],
      };

      facilityCodeUIValidation(errors, fieldData, formData);

      expect(
        addErrorSpy.calledWith(
          'You have already added this facility code to this form. Enter a new facility code, or cancel adding this additional location.',
        ),
      ).to.be.true;
    });
  });

  describe('#isPOEEligible', () => {
    it('should return true when first digit is 1-3 and second digit is 1-5', () => {
      expect(isPOEEligible('11123456')).to.equal(true);
      expect(isPOEEligible('12123456')).to.equal(true);
      expect(isPOEEligible('13123456')).to.equal(true);
      expect(isPOEEligible('14123456')).to.equal(true);
      expect(isPOEEligible('15123456')).to.equal(true);
      expect(isPOEEligible('21123456')).to.equal(true);
      expect(isPOEEligible('22123456')).to.equal(true);
      expect(isPOEEligible('23123456')).to.equal(true);
      expect(isPOEEligible('24123456')).to.equal(true);
      expect(isPOEEligible('25123456')).to.equal(true);
      expect(isPOEEligible('31123456')).to.equal(true);
      expect(isPOEEligible('32123456')).to.equal(true);
      expect(isPOEEligible('33123456')).to.equal(true);
      expect(isPOEEligible('34123456')).to.equal(true);
      expect(isPOEEligible('35123456')).to.equal(true);
    });

    it('should return false when first digit is not 1-3', () => {
      expect(isPOEEligible('41123456')).to.equal(false);
      expect(isPOEEligible('51123456')).to.equal(false);
      expect(isPOEEligible('61123456')).to.equal(false);
      expect(isPOEEligible('71123456')).to.equal(false);
      expect(isPOEEligible('81123456')).to.equal(false);
      expect(isPOEEligible('91123456')).to.equal(false);
    });

    it('should return false when first digit is 1-3 but second digit is not 1-5', () => {
      expect(isPOEEligible('10123456')).to.equal(false);
      expect(isPOEEligible('16123456')).to.equal(false);
      expect(isPOEEligible('20123456')).to.equal(false);
      expect(isPOEEligible('26123456')).to.equal(false);
      expect(isPOEEligible('30123456')).to.equal(false);
      expect(isPOEEligible('36123456')).to.equal(false);
    });
  });
});
