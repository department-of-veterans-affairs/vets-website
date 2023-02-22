import { expect } from 'chai';
import { getLabelForEditField, isInAllowList } from './index';

describe('check in utils', () => {
  describe('getLabelForEditField', () => {
    it('should return the default value of phone', () => {
      const expected = 'phone';

      expect(getLabelForEditField()).to.equal(expected);
    });
    it('should return home phone', () => {
      const expected = 'home phone';

      expect(getLabelForEditField('homePhone')).to.equal(expected);
    });
    it('should return work phone', () => {
      const expected = 'work phone';

      expect(getLabelForEditField('workPhone')).to.equal(expected);
    });
    it('should return mobile phone', () => {
      const expected = 'mobile phone';

      expect(getLabelForEditField('mobilePhone')).to.equal(expected);
    });
    it('should return address', () => {
      const expected = 'address';

      expect(getLabelForEditField('address')).to.equal(expected);
    });
    it('should return home address', () => {
      const expected = 'home address';

      expect(getLabelForEditField('homeAddress')).to.equal(expected);
    });
    it('should return mailing address', () => {
      const expected = 'mailing address';

      expect(getLabelForEditField('mailingAddress')).to.equal(expected);
    });
    it('should capitalize the first letter of the label type', () => {
      const expected = 'Mobile phone';

      expect(
        getLabelForEditField('mobilePhone', {
          capitalizeFirstLetter: true,
        }),
      ).to.equal(expected);
    });
  });

  describe('isInAllowList', () => {
    it('should return false if station not in list', () => {
      const appointment = {
        stationNo: '0002',
        clinicIen: '0001',
      };
      expect(isInAllowList(appointment)).to.be.false;
    });
    it('should return false if clinic not in list', () => {
      const appointment = {
        stationNo: '0001',
        clinicIen: '0002',
      };
      expect(isInAllowList(appointment)).to.be.false;
    });
    it('should return true if clinic, and station match', () => {
      const appointment = {
        stationNo: '0001',
        clinicIen: '0001',
      };
      expect(isInAllowList(appointment)).to.be.true;
    });
    it('should return true only station listed', () => {
      const appointment = {
        stationNo: '500',
        clinicIen: '3003',
      };
      expect(isInAllowList(appointment)).to.be.true;
    });
  });
});
