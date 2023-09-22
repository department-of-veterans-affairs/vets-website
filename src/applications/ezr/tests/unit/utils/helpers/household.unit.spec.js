import { expect } from 'chai';
import {
  includeSpousalInformation,
  isOfCollegeAge,
  getDependentPageList,
} from '../../../../utils/helpers/household';

describe('ezr household financial helpers', () => {
  describe('when `includeSpousalInformation` executes', () => {
    const formData = {
      discloseFinancialInformation: false,
      maritalStatus: 'never married',
    };

    describe('when financial disclose is `false`', () => {
      it('should return `false`', () => {
        expect(includeSpousalInformation(formData)).to.be.false;
      });
    });

    describe('when financial disclosure is `true`', () => {
      describe('when marital status is `never married`', () => {
        it('should return `false`', () => {
          expect(
            includeSpousalInformation({
              ...formData,
              discloseFinancialInformation: true,
            }),
          ).to.be.false;
        });
      });

      describe('when marital status is `married`', () => {
        it('should return `true`', () => {
          expect(
            includeSpousalInformation({
              ...formData,
              discloseFinancialInformation: true,
              maritalStatus: 'married',
            }),
          ).to.be.true;
        });
      });

      describe('when marital status is `separated`', () => {
        it('should return `true`', () => {
          expect(
            includeSpousalInformation({
              ...formData,
              discloseFinancialInformation: true,
              maritalStatus: 'separated',
            }),
          ).to.be.true;
        });
      });
    });
  });

  describe('when `isOfCollegeAge` executes', () => {
    describe('when birthdate is greater than 23 years from testdate', () => {
      it('should return `false`', () => {
        const birthdate = '1986-06-01';
        const testdate = '2023-06-01';
        expect(isOfCollegeAge(birthdate, testdate)).to.be.false;
      });
    });

    describe('when birthdate is less than 18 years from testdate', () => {
      it('should return `false`', () => {
        const birthdate = '2005-06-02';
        const testdate = '2023-06-01';
        expect(isOfCollegeAge(birthdate, testdate)).to.be.false;
      });
    });

    describe('when birthdate is exactly 18 years from testdate', () => {
      it('should return `true`', () => {
        const birthdate = '2005-06-01';
        const testdate = '2023-06-01';
        expect(isOfCollegeAge(birthdate, testdate)).to.be.true;
      });
    });

    describe('when birthdate is exactly 23 years from testdate', () => {
      it('should return `true`', () => {
        const birthdate = '2000-06-01';
        const testdate = '2023-06-01';
        expect(isOfCollegeAge(birthdate, testdate)).to.be.true;
      });
    });

    describe('when birthdate is between 18 and 23 years from testdate', () => {
      it('should return `true`', () => {
        const birthdate = '2003-06-01';
        const testdate = '2023-06-01';
        expect(isOfCollegeAge(birthdate, testdate)).to.be.true;
      });
    });
  });

  describe('when `getDependentPageList` executes', () => {
    const pages = [
      { id: 'page1', title: 'Page 1' },
      { id: 'page2', title: 'Page 2', depends: { key: 'key1', value: false } },
      { id: 'page3', title: 'Page 3' },
      { id: 'page4', title: 'Page 4', depends: { key: 'key2', value: true } },
      { id: 'page5', title: 'Page 5', depends: { key: 'key3', value: false } },
    ];

    describe('when page entries do not have conditional dependencies', () => {
      it('should return a list of only pages without a conditional dependency', () => {
        const formData = {};
        expect(getDependentPageList(pages, formData)).to.have.lengthOf(2);
      });
    });

    describe('when two conditional dependencies do not match', () => {
      it('should return a list of three (3) pages', () => {
        const formData = { key1: true, key2: true, key3: true };
        expect(getDependentPageList(pages, formData)).to.have.lengthOf(3);
      });
    });

    describe('when one conditional dependency does not match', () => {
      it('should return a list of four (4) pages', () => {
        const formData = { key1: false, key2: true, key3: true };
        expect(getDependentPageList(pages, formData)).to.have.lengthOf(4);
      });
    });

    describe('when all conditional dependencies match', () => {
      it('should return a list of all pages', () => {
        const formData = { key1: false, key2: true, key3: false };
        expect(getDependentPageList(pages, formData)).to.have.lengthOf(5);
      });
    });
  });
});
