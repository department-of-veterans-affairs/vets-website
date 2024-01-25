import { expect } from 'chai';
import {
  isOfCollegeAge,
  getDependentPageList,
  hasGrossIncome,
} from '../../../../utils/helpers/household';

describe('ezr household information helpers', () => {
  context('when `isOfCollegeAge` executes', () => {
    context('when birthdate is greater than 23 years from testdate', () => {
      it('should return `false`', () => {
        const birthdate = '1986-06-01';
        const testdate = '2023-06-01';
        expect(isOfCollegeAge(birthdate, testdate)).to.be.false;
      });
    });

    context('when birthdate is less than 18 years from testdate', () => {
      it('should return `false`', () => {
        const birthdate = '2005-06-02';
        const testdate = '2023-06-01';
        expect(isOfCollegeAge(birthdate, testdate)).to.be.false;
      });
    });

    context('when birthdate is exactly 18 years from testdate', () => {
      it('should return `true`', () => {
        const birthdate = '2005-06-01';
        const testdate = '2023-06-01';
        expect(isOfCollegeAge(birthdate, testdate)).to.be.true;
      });
    });

    context('when birthdate is exactly 23 years from testdate', () => {
      it('should return `true`', () => {
        const birthdate = '2000-06-01';
        const testdate = '2023-06-01';
        expect(isOfCollegeAge(birthdate, testdate)).to.be.true;
      });
    });

    context('when birthdate is between 18 and 23 years from testdate', () => {
      it('should return `true`', () => {
        const birthdate = '2003-06-01';
        const testdate = '2023-06-01';
        expect(isOfCollegeAge(birthdate, testdate)).to.be.true;
      });
    });
  });

  context('when `hasGrossIncome` executes', () => {
    context('when the dependent has earned at least $1 in gross income', () => {
      it('should return `true`', () => {
        let income = 1;
        expect(hasGrossIncome(income)).to.be.true;

        income = 21736;
        expect(hasGrossIncome(income)).to.be.true;
      });
    });

    context(
      'when the dependent has not earned at least $1 in gross income',
      () => {
        it('should return `false`', () => {
          const income = 0;
          expect(hasGrossIncome(income)).to.be.false;
        });
      },
    );
  });

  context('when `getDependentPageList` executes', () => {
    const pages = [
      { id: 'page1', title: 'Page 1' },
      { id: 'page2', title: 'Page 2' },
      {
        id: 'page3',
        title: 'Page 3',
        depends: [{ key: 'key1', value: false }],
      },
      { id: 'page4', title: 'Page 4', depends: [{ key: 'key2', value: true }] },
      {
        id: 'page5',
        title: 'Page 5',
        depends: [
          { key: 'key3', value: true },
          { key: 'key4', value: true },
          { key: 'key5', value: true },
        ],
      },
    ];

    context('when page entries do not have conditional dependencies', () => {
      it('should return a list of non-conditional pages when form data is omitted', () => {
        expect(getDependentPageList(pages)).to.have.lengthOf(2);
      });

      it('should return a list of non-conditional pages when form data is included', () => {
        const formData = {};
        expect(getDependentPageList(pages, formData)).to.have.lengthOf(2);
      });
    });

    context('when two conditional dependencies do not match', () => {
      it('should return a list of three (3) pages', () => {
        const formData = {
          key1: true,
          key2: true,
          key3: true,
          key4: true,
          key5: { key: false },
        };
        expect(getDependentPageList(pages, formData)).to.have.lengthOf(3);
      });
    });

    context('when one conditional dependency does not match', () => {
      it('should return a list of four (4) pages', () => {
        const formData = {
          key1: false,
          key2: true,
          key3: true,
          key4: true,
          key5: { key: false },
        };
        expect(getDependentPageList(pages, formData)).to.have.lengthOf(4);
      });
    });

    context('when one conditional dependency contains a function value', () => {
      it('should return a list of five (5) pages', () => {
        const formData = {
          key1: false,
          key2: false,
          key3: true,
          key4: true,
          key5: { key: true },
        };
        const altPages = [
          ...pages,
          {
            id: 'page6',
            title: 'Page 6',
            depends: [
              {
                key: 'key3',
                value: val => val === true,
              },
            ],
          },
        ];
        expect(getDependentPageList(altPages, formData)).to.have.lengthOf(5);
      });

      it('should return a list of all pages when the form data matches the function conditional', () => {
        const formData = {
          key1: false,
          key2: true,
          key3: true,
          key4: true,
          key5: true,
        };
        const altPages = [
          ...pages,
          {
            id: 'page6',
            title: 'Page 6',
            depends: [
              {
                key: 'key3',
                value: val => val === true,
              },
            ],
          },
        ];
        expect(getDependentPageList(altPages, formData)).to.have.lengthOf(6);
      });
    });

    context('when all conditional dependencies match', () => {
      it('should return a list of all pages', () => {
        const formData = {
          key1: false,
          key2: true,
          key3: true,
          key4: true,
          key5: { key: true },
        };
        expect(getDependentPageList(pages, formData)).to.have.lengthOf(5);
      });
    });
  });
});
