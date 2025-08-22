import { expect } from 'chai';

import {
  saveEditContactInformation,
  getEditContactInformation,
  removeEditContactInformation,
  convertPhoneObjectToString,
} from '../../../util/contact-info';

describe('util/contact-info', () => {
  describe('saveEditContactInformation', () => {
    it('should save contact information edit action to sessionStorage', () => {
      const name = 'address';
      const action = 'update';
      saveEditContactInformation(name, action);
      const storedValue = sessionStorage.getItem('editContactInformation');
      expect(storedValue).to.equal(`${name},${action}`);
    });
  });

  describe('getEditContactInformation', () => {
    it('should retrieve contact information edit action from sessionStorage', () => {
      const name = 'phone';
      const action = 'add';
      sessionStorage.setItem('editContactInformation', `${name},${action}`);
      const result = getEditContactInformation();
      expect(result).to.deep.equal({ name, action });
    });

    it('should return empty object if no edit information is stored', () => {
      sessionStorage.removeItem('editContactInformation');
      const result = getEditContactInformation();
      expect(result).to.deep.equal({ name: '', action: undefined });
    });
  });

  describe('removeEditContactInformation', () => {
    it('should remove contact information edit action from sessionStorage', () => {
      const name = 'address';
      const action = 'update';
      sessionStorage.setItem('editContactInformation', `${name},${action}`);
      removeEditContactInformation();
      const result = getEditContactInformation();
      expect(result).to.deep.equal({ name: '', action: undefined });
    });
  });

  describe('convertPhoneObjectToString', () => {
    it('should convert phone object to string', () => {
      const phoneObject = {
        areaCode: '555',
        phoneNumber: '1234567',
        isInternational: false,
        countryCode: '',
      };
      const result = convertPhoneObjectToString(phoneObject);
      expect(result).to.equal('5551234567');
    });

    it('should convert international phone object to string', () => {
      const phoneObject = {
        areaCode: '555',
        phoneNumber: '1234567',
        isInternational: true,
        countryCode: '44',
      };
      const result = convertPhoneObjectToString(phoneObject);
      expect(result).to.equal('445551234567');
    });
  });
});
