import { expect } from 'chai';
import {
  DIARY_CODE_STATUS_TYPE,
  getStatusTypeForDebtDiaryCode,
} from '../const/diary-codes/diaryCodeStatusTypes';

describe('diaryCodeStatusTypes', () => {
  describe('DIARY_CODE_STATUS_TYPE mapping', () => {
    it('has correct mappings for status type 1 (Account updates)', () => {
      const statusType1Codes = [
        '002',
        '005',
        '032',
        '321',
        '400',
        '420',
        '421',
        '422',
        '481',
        '482',
        '483',
        '484',
        '609',
        '627',
        '816',
      ];

      statusType1Codes.forEach(code => {
        expect(DIARY_CODE_STATUS_TYPE[code]).to.equal('1');
      });
    });

    it('has correct mappings for status type 2 (Treasury warning)', () => {
      const statusType2Codes = ['081', '500', '503', '510'];

      statusType2Codes.forEach(code => {
        expect(DIARY_CODE_STATUS_TYPE[code]).to.equal('2');
      });
    });

    it('has correct mappings for status type 8 (Payment due)', () => {
      const statusType8Codes = [
        '100',
        '102',
        '109',
        '117',
        '123',
        '130',
        '140',
      ];

      statusType8Codes.forEach(code => {
        expect(DIARY_CODE_STATUS_TYPE[code]).to.equal('8');
      });
    });

    it('has correct mappings for status type 9 (Currently due payments)', () => {
      const statusType9Codes = ['439', '449', '459', '603', '613', '680'];

      statusType9Codes.forEach(code => {
        expect(DIARY_CODE_STATUS_TYPE[code]).to.equal('9');
      });
    });

    it('has correct mappings for status type 10 (Treasury)', () => {
      const statusType10Codes = [
        '080',
        '681',
        '682',
        '850',
        '852',
        '855',
        '860',
      ];

      statusType10Codes.forEach(code => {
        expect(DIARY_CODE_STATUS_TYPE[code]).to.equal('10');
      });
    });

    it('has correct mappings for special status types', () => {
      expect(DIARY_CODE_STATUS_TYPE['71']).to.equal('11');
      expect(DIARY_CODE_STATUS_TYPE['212']).to.equal('12');
      expect(DIARY_CODE_STATUS_TYPE['655']).to.equal('13');
      expect(DIARY_CODE_STATUS_TYPE['817']).to.equal('13');
    });
  });

  describe('getStatusTypeForDebtDiaryCode', () => {
    it('returns correct status type for known diary codes', () => {
      expect(getStatusTypeForDebtDiaryCode('109')).to.equal('8');
      expect(getStatusTypeForDebtDiaryCode('080')).to.equal('10');
      expect(getStatusTypeForDebtDiaryCode('081')).to.equal('2');
      expect(getStatusTypeForDebtDiaryCode('002')).to.equal('1');
    });

    it('returns default for unknown diary codes', () => {
      expect(getStatusTypeForDebtDiaryCode('999')).to.equal('default');
      expect(getStatusTypeForDebtDiaryCode('ABC')).to.equal('default');
      expect(getStatusTypeForDebtDiaryCode('')).to.equal('default');
      expect(getStatusTypeForDebtDiaryCode(null)).to.equal('default');
      expect(getStatusTypeForDebtDiaryCode(undefined)).to.equal('default');
      expect(getStatusTypeForDebtDiaryCode('0')).to.equal('default');
      expect(getStatusTypeForDebtDiaryCode('-1')).to.equal('default');
    });
  });

  describe('status type coverage', () => {
    it('covers all expected status types (1-13)', () => {
      const statusTypes = new Set(Object.values(DIARY_CODE_STATUS_TYPE));
      const expectedTypes = [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
      ];

      expectedTypes.forEach(type => {
        expect(statusTypes.has(type)).to.be.true;
      });
    });

    it('has no duplicate diary codes', () => {
      const codes = Object.keys(DIARY_CODE_STATUS_TYPE);
      const uniqueCodes = new Set(codes);

      expect(codes.length).to.equal(uniqueCodes.size);
    });
  });
});
