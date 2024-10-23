import { expect } from 'chai';
import {
  contactRules,
  getContactMethods,
  isEqualToOnlyEmail,
} from '../../config/helpers';

describe('Components and Utility Functions', () => {
  describe('contactRules object', () => {
    it('should contain correct contact methods for "Benefits issues outside the U.S." and "Disability compensation"', () => {
      expect(contactRules['Benefits issues outside the U.S.']).to.have.property(
        'Disability compensation',
      );
      expect(
        contactRules['Benefits issues outside the U.S.'][
          'Disability compensation'
        ],
      ).to.include.members(['EMAIL', 'PHONE', 'US_MAIL']);
    });

    it('should contain correct contact methods for "Education benefits and work study" and "Work study"', () => {
      expect(
        contactRules['Education benefits and work study'],
      ).to.have.property('Work study');
      expect(
        contactRules['Education benefits and work study']['Work study'],
      ).to.include.members(['EMAIL']);
    });
  });

  describe('getContactMethods', () => {
    it('should return correct methods for a given category and topic', () => {
      const methods = getContactMethods(
        'Disability compensation',
        'Aid and Attendance or Housebound benefits',
      );
      expect(methods).to.deep.equal({
        EMAIL: 'Email',
        PHONE: 'Phone call',
        US_MAIL: 'U.S. mail',
      });
    });

    it('should return all methods if category or topic not found', () => {
      const methods = getContactMethods(
        'Nonexistent Category',
        'Nonexistent Topic',
      );
      expect(methods).to.deep.equal({
        EMAIL: 'Email',
        PHONE: 'Phone call',
        US_MAIL: 'U.S. mail',
      });
    });
  });

  describe('isEqualToOnlyEmail', () => {
    it('should return true if the object contains only EMAIL key with value "Email"', () => {
      const result = isEqualToOnlyEmail({ EMAIL: 'Email' });
      expect(result).to.be.true;
    });

    it('should return false if the object contains more than one method', () => {
      const result = isEqualToOnlyEmail({
        EMAIL: 'Email',
        PHONE: 'Phone call',
      });
      expect(result).to.be.false;
    });

    it('should return false if the object contains only EMAIL but with incorrect value', () => {
      const result = isEqualToOnlyEmail({ EMAIL: 'Incorrect' });
      expect(result).to.be.false;
    });
  });
});
