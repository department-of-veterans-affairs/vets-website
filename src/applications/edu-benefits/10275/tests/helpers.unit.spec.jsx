import { expect } from 'chai';
import { render } from '@testing-library/react';
import { getCardDescription, getItemName } from '../helpers';

describe('Helpers', () => {
  describe('getCardDescription', () => {
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
      expect(getByTestId('card-address').textContent).to.equal(', CA 12345');
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
  describe('getItemName', () => {
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
});
