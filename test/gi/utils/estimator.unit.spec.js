import { expect } from 'chai';
import Estimator from '../../../src/js/gi/utils/Estimator.jsx';


describe('Estimator unit tests', () =>{
  const estimator = new Estimator();

  describe('Minnesota Power Company', () => {
    const school = {};
    school.bah = '1476';
    school.country = 'USA';
    school.institution_type = {name: 'ojt'};

    context('default dropdown selections', () => {
      estimator.military_status = 'veteran';
      estimator.spouse_active_duty = 'no';
      estimator.gi_bill_chap = '33';
      estimator.number_of_depend = '0';
      estimator.post_911_elig = 'no';
      estimator.cumulative_service = '1.0';
      estimator.enlistment_service = '3';
      estimator.consecutive_service = '0.8';
      estimator.online = 'no';
      estimator.institution_type = school.institution_type.name;
      estimator.country = school.country;
      estimator.bah = school.bah;

      it('should return the correct tuition estimate', () => {
        estimator.renderTuitionFees();
        expect(estimator.results.tuition.qualifier).to.eql(null);
        expect(estimator.results.tuition.value).to.eql('N/A');
      });

      it('should return the correct housing estimate', () => {
        estimator.renderHousingAllowance();
        expect(estimator.results.housing.qualifier).to.eql('per month');
        expect(estimator.results.housing.value).to.eql(1476);
      });

      it('should return the correct books estimate', () => {
        estimator.renderBookStipend();
        expect(estimator.results.books.qualifier).to.eql('per year');
        expect(estimator.results.books.value).to.eql(1000);
      });

    });

  });

  // describe('Northland College', () => {
  //   const school = {};
  //
  //   context('', () => {
  //
  //   }
  //
  //   context('', () => {
  //
  //   }
  //
  // });

  // describe('Harvard', () => {
  //   const school = {};
  //
  //   context('', () => {
  //
  //   }
  //
  //   context('', () => {
  //
  //   }
  //
  // });

  // describe('Stanford', () => {
  //   const school = {};
  //
  //   context('', () => {
  //
  //   }
  //
  //   context('', () => {
  //
  //   }
  //
  // });

});

// import _ from 'lodash';
//

// describe('Validations unit tests', () => {
//   describe('isValidSpouseInformation', () => {
//     const spouseTestData = {
//       maritalStatus: {
//         value: 'foo'
//       },
//       spouseAddress: {
//         country: { value: 'USA' },
//         state: { value: 'AL' },
//         zipcode: { value: '12345' },
//         street: { value: 'foo' },
//         city: { value: 'foo' }
//       },
//       spousePhone: {
//         value: '1115551234'
//       },
//       sameAddress: {
//         value: 'N'
//       },
//       discloseFinancialInformation: {
//         value: 'Y'
//       }
//     };
//
//     context('with a valid address', () => {
//       it('should return true', () => {
//         expect(isValidSpouseInformation(spouseTestData)).to.be.true;
//       });
//     });
//
//     context('with an invalid address', () => {
//       let spouseTestDataInvalidAddress;
//
//       before(() => {
//         spouseTestDataInvalidAddress = _.cloneDeep(spouseTestData);
//         spouseTestDataInvalidAddress.spouseAddress.zipcode.value = '';
//       });
//
//       it('should return false', () => {
//         expect(isValidSpouseInformation(spouseTestDataInvalidAddress)).to.be.false;
//       });
//     });
//   });
// });
//
// describe('Validations unit tests', () => {
//   describe('isValidLastName', () => {
//     [
//       {
//         lastName: 'fo',
//         allowed: true
//       },
//       {
//         lastName: 'foo',
//         allowed: true
//       },
//       {
//         lastName: 'f',
//         allowed: false
//       },
//     ].forEach((lastNameTest) => {
//       it(`should${lastNameTest.allowed ? '' : "n't"} allow a last name of ${lastNameTest.lastName}`, () => {
//         expect(isValidLastName(lastNameTest.lastName)).to.eql(lastNameTest.allowed);
//       });
//     });
//   });
// });
