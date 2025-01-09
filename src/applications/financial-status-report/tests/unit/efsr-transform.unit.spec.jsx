import { expect } from 'chai';
import { formatDateShort } from 'platform/utilities/date';
import { transform } from '../../utils/transform';
// import inputObject from './unit-maximal.json';
import inputObject from './efsr-unit-maximal.json';
import {
  sumValues,
  monthYearFormatter,
  getFsrReason,
  filterReduceByName,
  otherDeductionsAmt,
  getEmploymentHistory,
  getTotalAssets,
  otherDeductionsName,
  nameStr,
} from '../../utils/helpers';
import { getMonthlyIncome } from '../../utils/calculateIncome';
import { getMonthlyExpenses } from '../../utils/calculateExpenses';

describe('efsr-fsr transform helper functions', () => {
  describe('efsr-monthYearFormatter helper', () => {
    it('should return formatted date MM/YYYY', () => {
      expect(monthYearFormatter('2004-10-XX')).to.equal('10/2004');
    });
    it('should return undefined if input is falsy', () => {
      expect(monthYearFormatter('')).to.equal('');
    });
  });

  describe('efsr-getFsrReason helper', () => {
    it('should return string of unique fsr reasons comma separated', () => {
      const debts = [
        { resolutionOption: 'monthly' },
        { resolutionOption: 'monthly' },
        { resolutionOption: 'waiver' },
        { resolutionOption: 'compromise' },
      ];
      expect(getFsrReason(debts)).to.equal(
        'Extended monthly payments, Waiver, Compromise',
      );
    });
  });

  describe('efsr-sumValue helper', () => {
    it('should sum specified object keys in list of objects', () => {
      const objectList = Array(5).fill({ someKey: '10' });
      expect(sumValues(objectList, 'someKey')).to.equal(50);
    });
    it('should return zero when passed a non array', () => {
      const notAnArray = {};
      expect(sumValues(notAnArray, 'someKey')).to.equal(0);
    });
    it('should return zero when passed an empty array', () => {
      const emptyArray = [];
      expect(sumValues(emptyArray, 'someKey')).to.equal(0);
    });
    it('should return zero when no object in list has input key', () => {
      const objectList = Array(5).fill({ someKey: '10' });
      expect(sumValues(objectList, 'someIncorrectKey')).to.equal(0);
    });
  });

  describe('efsr-filterReduceByName helper', () => {
    it('should return deductions based on elements in filter array', () => {
      const deductions = [
        {
          name: 'Federal tax',
          amount: '350.56',
        },
        {
          name: 'State tax',
          amount: '230.45',
        },
        {
          name: 'Pension',
          amount: '100',
        },
        {
          name: 'Health insurance',
          amount: '254.45',
        },
      ];
      const filter = ['State tax', 'Federal tax', 'Local tax'];
      expect(filterReduceByName(deductions, filter)).to.equal(581.01);
    });
    it('should return 0 if deduction list is empty', () => {
      const deductions = [];
      const filter = ['State tax', 'Federal tax', 'Local tax'];
      expect(filterReduceByName(deductions, filter)).to.equal(0);
    });
  });

  describe('efsr-otherDeductionsAmt helper', () => {
    it('should return string of unique fsr reasons comma separated', () => {
      const deductions = [
        {
          name: 'Federal tax',
          amount: '350.56',
        },
        {
          name: 'State tax',
          amount: '230.45',
        },
        {
          name: 'Pension',
          amount: '100',
        },
        {
          name: 'Health insurance',
          amount: '254.45',
        },
      ];
      const allFilters = [
        'State tax',
        'Federal tax',
        'Local tax',
        '401K',
        'IRA',
        'Pension',
        'FICA (Social Security and Medicare)',
      ];
      expect(otherDeductionsAmt(deductions, allFilters)).to.equal(254.45);
    });
  });

  // Depends on sumValues, filterReduceByName, otherDeductionsAmt - getMonthlyIncome
  describe('efsr getMonthlyIncome helper', () => {
    it('should return monthy income based on veterans net and other income, and spouses net and other income', () => {
      const result = getMonthlyIncome(inputObject.data);

      // Veteran's income
      const { vetIncome } = result;
      expect(vetIncome.grossSalary).to.equal(7001.1);
      expect(vetIncome.deductions.taxes).to.equal(781.03);
      expect(vetIncome.deductions.retirement).to.equal(100);
      expect(vetIncome.deductions.socialSecurity).to.equal(122.4);
      expect(vetIncome.deductions.otherDeductions.amount).to.deep.equal(389.01);
      expect(vetIncome.totalDeductions).to.equal(1392.44);
      expect(vetIncome.netTakeHomePay).to.equal(5608.66);
      expect(vetIncome.otherIncome.name).to.equal(
        'Disability Compensation, Education, Social Security, Employment bonus, Alimony',
      );
      expect(vetIncome.otherIncome.amount).to.equal(7012.85);
      expect(vetIncome.totalMonthlyNetIncome).to.equal(12621.51);

      // Spouse's income
      const { spIncome } = result;
      expect(spIncome.grossSalary).to.equal(5000.54);
      expect(spIncome.deductions.taxes).to.equal(581.01);
      expect(spIncome.deductions.retirement).to.equal(100);
      expect(spIncome.deductions.socialSecurity).to.equal(0);
      expect(spIncome.deductions.otherDeductions.amount).to.deep.equal(254.45);
      expect(spIncome.totalDeductions).to.equal(935.46);
      expect(spIncome.netTakeHomePay).to.equal(4065.08);
      expect(spIncome.otherIncome.name).to.equal(
        'Disability Compensation, Education, Child support, Alimony, Social Security',
      );
      expect(spIncome.otherIncome.amount).to.equal(4701.77);
      expect(spIncome.totalMonthlyNetIncome).to.equal(8766.85);

      // Total income
      expect(result.totalMonthlyNetIncome).to.equal(21388.36);
    });
  });

  // depends on sumValues
  describe('efsr-getMonthlyExpenses helper', () => {
    it('should calculate the sum of total monthly expenses for enhanced financial status report', () => {
      const expenses = {
        expenses: {
          expenseRecords: [{ name: 'Rent', amount: '100' }],
        },
        otherExpenses: [
          { name: 'Food', amount: '100' },
          { name: 'Veteran added', amount: '100' },
        ],
        utilityRecords: [
          { name: 'Electricity', amount: '100' },
          { name: 'Water', amount: '100' },
        ],
        installmentContracts: [
          { amountDueMonthly: '100' },
          { amountDueMonthly: '100' },
        ],
      };

      // Call the function to test
      const result = getMonthlyExpenses(expenses);

      // Expected result: 100 (Rent) + 100 (Food) + 100 (Veteran added) + 100 (Electricity) + 100 (Water) + 100 + 100 (Installment contracts) = 700
      expect(result).to.equal(700);
    });
  });

  // depends on sumValues
  describe('efsr-getEmploymentHistory helper', () => {
    it('should return a veterans employment history', () => {
      const history = {
        questions: {
          spouseIsEmployed: false,
          vetIsEmployed: true,
        },
        personalData: {
          employmentHistory: {
            veteran: {
              employmentRecords: [
                {
                  type: 'Full time',
                  from: '2017-1-XX',
                  to: '',
                  isCurrent: true,
                  employerName: 'Veteran Current One',
                },
              ],
            },
          },
        },
      };

      const returnVal = getEmploymentHistory(history);
      expect(returnVal).to.be.an('array');
      expect(returnVal.length).to.equal(1);
      expect(returnVal[0].veteranOrSpouse).to.equal('VETERAN');
      expect(returnVal[0].occupationName).to.equal('Full time');
      expect(returnVal[0].from).to.equal('01/2017');
      expect(returnVal[0].to).to.equal('');
      expect(returnVal[0].present).to.equal(true);
      expect(returnVal[0].employerName).to.equal('Veteran Current One');

      expect(returnVal[0].employerAddress).to.be.an('object');
      expect(returnVal[0].employerAddress.addresslineOne).to.equal('');
      expect(returnVal[0].employerAddress.addresslineTwo).to.equal('');
      expect(returnVal[0].employerAddress.addresslineThree).to.equal('');
      expect(returnVal[0].employerAddress.city).to.equal('');
      expect(returnVal[0].employerAddress.stateOrProvince).to.equal('');
      expect(returnVal[0].employerAddress.zipOrPostalCode).to.equal('');
      expect(returnVal[0].employerAddress.countryName).to.equal('');
    });

    it('should return a spouses employment history', () => {
      const history = {
        questions: {
          spouseIsEmployed: true,
          vetIsEmployed: false,
        },
        personalData: {
          employmentHistory: {
            spouse: {
              spEmploymentRecords: [
                {
                  type: 'Full time',
                  from: '2018-6-XX',
                  to: '',
                  isCurrent: true,
                  employerName: 'Spouse Current',
                },
              ],
            },
          },
        },
      };

      const returnVal = getEmploymentHistory(history);
      expect(returnVal).to.be.an('array');
      expect(returnVal.length).to.equal(1);
      expect(returnVal[0].veteranOrSpouse).to.equal('SPOUSE');
      expect(returnVal[0].occupationName).to.equal('Full time');
      expect(returnVal[0].from).to.equal('06/2018');
      expect(returnVal[0].to).to.equal('');
      expect(returnVal[0].present).to.equal(true);
      expect(returnVal[0].employerName).to.equal('Spouse Current');

      expect(returnVal[0].employerAddress).to.be.an('object');
      expect(returnVal[0].employerAddress.addresslineOne).to.equal('');
      expect(returnVal[0].employerAddress.addresslineTwo).to.equal('');
      expect(returnVal[0].employerAddress.addresslineThree).to.equal('');
      expect(returnVal[0].employerAddress.city).to.equal('');
      expect(returnVal[0].employerAddress.stateOrProvince).to.equal('');
      expect(returnVal[0].employerAddress.zipOrPostalCode).to.equal('');
      expect(returnVal[0].employerAddress.countryName).to.equal('');
    });

    it('should return an empty array provided no employment history for veteran and spouse', () => {
      const history = {
        questions: {
          spouseIsEmployed: false,
          vetIsEmployed: false,
        },
        personalData: {},
      };
      const returnVal = getEmploymentHistory(history);
      expect(returnVal).to.be.an('array');
      expect(returnVal.length).to.equal(0);
    });
  });

  describe('efsr-getTotalAssets helper', () => {
    it('should return total value of assets excluding vehicles', () => {
      const totalAssets = {
        questions: {
          hasVehicle: false,
        },
        assets: {
          realEstateValue: '2000',
          otherAssets: [
            {
              amount: '10',
            },
            {
              amount: '10',
            },
          ],
          recVehicleAmount: '100',
          automobiles: [
            {
              resaleValue: '100',
            },
            {
              resaleValue: '100',
            },
          ],
        },
      };
      expect(getTotalAssets(totalAssets)).to.equal(2120);
    });

    it('should return total value of assets including vehicles', () => {
      const totalAssets = {
        questions: {
          hasVehicle: true,
        },
        assets: {
          realEstateValue: '2000',
          otherAssets: [
            {
              amount: '10',
            },
            {
              amount: '10',
            },
          ],
          recVehicleAmount: '100',
          automobiles: [
            {
              resaleValue: '100',
            },
            {
              resaleValue: '100',
            },
          ],
        },
      };
      expect(getTotalAssets(totalAssets)).to.equal(2320);
    });
  });

  describe('efsr-otherDeductionsName helper', () => {
    const allFilters = [
      'State tax',
      'Federal tax',
      'Local tax',
      '401K',
      'IRA',
      'Pension',
      'FICA (Social Security and Medicare)',
    ];

    it('should return list of other deduction names', () => {
      const deductions = [
        {
          name: 'Federal tax',
          amount: '350.56',
        },
        {
          name: 'State tax',
          amount: '230.45',
        },
        {
          name: 'Pension',
          amount: '100',
        },
        {
          name: 'Health insurance',
          amount: '254.45',
        },
      ];
      expect(otherDeductionsName(deductions, allFilters)).to.equal(
        'Health insurance',
      );
    });

    it('should return empty string if no deductions exist', () => {
      const deductions = [];
      expect(otherDeductionsName(deductions, allFilters)).to.equal('');
    });
  });

  describe('efsr-nameStr helper', () => {
    it('should return string of all other vet and/or spuse income when non zero', () => {
      const addlIncRecords = [
        {
          name: 'Bonus payment',
          amount: '1500.67',
        },
        {
          name: 'Freelance service',
          amount: '1000.43',
        },
      ];
      expect(nameStr(100, 200, 300, addlIncRecords)).to.equal(
        'Social Security, Disability Compensation, Education, Bonus payment, Freelance service',
      );
    });
    it('should return empty string when no other income is truthy', () => {
      const addlIncRecords = [];
      expect(nameStr(0, 0, 0, addlIncRecords)).to.equal('');
    });
  });
});

describe('efsr-fsr transform information', () => {
  describe('efsr-personalIdentification', () => {
    it('has valid structure', () => {
      const submissionObj = JSON.parse(transform(null, inputObject));
      expect(submissionObj).haveOwnProperty('personalIdentification');
      expect(submissionObj.personalIdentification).to.be.an('object');
      expect(submissionObj.personalIdentification).haveOwnProperty('ssn');
      expect(submissionObj.personalIdentification).haveOwnProperty(
        'fileNumber',
      );
      expect(submissionObj.personalIdentification).haveOwnProperty('fsrReason');
    });
    it('has valid data', () => {
      const submissionObj = JSON.parse(transform(null, inputObject));
      expect(submissionObj.personalIdentification.ssn).to.equal('1234');
      expect(submissionObj.personalIdentification.fileNumber).to.equal('5678');
      expect(submissionObj.personalIdentification.fsrReason).to.equal(
        'Waiver, Extended monthly payments, Compromise',
      );
    });
  });
  describe('efsr-personalData', () => {
    it('has valid structure', () => {
      const submissionObj = JSON.parse(transform(null, inputObject));
      expect(submissionObj).haveOwnProperty('personalData');
      expect(submissionObj.personalData).to.be.an('object');
      expect(submissionObj.personalData).haveOwnProperty('veteranFullName');
      expect(submissionObj.personalData.veteranFullName).to.be.an('object');
      expect(submissionObj.personalData).haveOwnProperty('telephoneNumber');
      expect(submissionObj.personalData).haveOwnProperty('dateOfBirth');
      expect(submissionObj.personalData).haveOwnProperty('married');
      expect(submissionObj.personalData).haveOwnProperty('spouseFullName');
      expect(submissionObj.personalData.spouseFullName).to.be.an('object');
      expect(submissionObj.personalData).haveOwnProperty(
        'agesOfOtherDependents',
      );
      expect(submissionObj.personalData.agesOfOtherDependents).to.be.an(
        'array',
      );
    });
    it('has valid data', () => {
      const submissionObj = JSON.parse(transform(null, inputObject));
      expect(submissionObj).haveOwnProperty('personalData');
      expect(submissionObj.personalData.telephoneNumber).to.equal(
        '(510) 922-4444',
      );
      expect(submissionObj.personalData.dateOfBirth).to.equal('04/05/1933');
      expect(submissionObj.personalData.married).to.equal(true);
      expect(submissionObj.personalData.agesOfOtherDependents[0]).to.equal(
        '12',
      );
      expect(submissionObj.personalData.agesOfOtherDependents[1]).to.equal(
        '17',
      );
      expect(submissionObj.personalData.dateOfBirth).to.equal('04/05/1933');
    });
    describe('efsr-veteran full name', () => {
      it('has valid strucutre', () => {
        const submissionObj = JSON.parse(transform(null, inputObject));
        expect(submissionObj).haveOwnProperty('personalData');
        expect(submissionObj.personalData).to.be.an('object');
        expect(submissionObj.personalData).haveOwnProperty('veteranFullName');
        expect(submissionObj.personalData.veteranFullName).to.be.an('object');
        expect(submissionObj.personalData.veteranFullName).haveOwnProperty(
          'first',
        );
        expect(submissionObj.personalData.veteranFullName).haveOwnProperty(
          'middle',
        );
        expect(submissionObj.personalData.veteranFullName).haveOwnProperty(
          'last',
        );
      });
      it('has valid data', () => {
        const submissionObj = JSON.parse(transform(null, inputObject));
        expect(submissionObj.personalData.veteranFullName.first).to.equal(
          'Greg',
        );
        expect(submissionObj.personalData.veteranFullName.middle).to.equal('A');
        expect(submissionObj.personalData.veteranFullName.last).to.equal(
          'Anderson',
        );
      });
    });
    describe('efsr-spouse full name', () => {
      it('has valid strucutre', () => {
        const submissionObj = JSON.parse(transform(null, inputObject));
        expect(submissionObj).haveOwnProperty('personalData');
        expect(submissionObj.personalData).to.be.an('object');
        expect(submissionObj.personalData).haveOwnProperty('spouseFullName');
        expect(submissionObj.personalData.spouseFullName).to.be.an('object');
        expect(submissionObj.personalData.spouseFullName).haveOwnProperty(
          'first',
        );
        expect(submissionObj.personalData.spouseFullName).haveOwnProperty(
          'middle',
        );
        expect(submissionObj.personalData.spouseFullName).haveOwnProperty(
          'last',
        );
      });
      it('has valid data', () => {
        const submissionObj = JSON.parse(transform(null, inputObject));
        expect(submissionObj.personalData.spouseFullName.first).to.equal(
          'Angela',
        );
        expect(submissionObj.personalData.spouseFullName.middle).to.equal('');
        expect(submissionObj.personalData.spouseFullName.last).to.equal(
          'Mitchell',
        );
      });
    });
    describe('efsr-address', () => {
      it('has valid structure', () => {
        const submissionObj = JSON.parse(transform(null, inputObject));
        expect(submissionObj.personalData).haveOwnProperty('address');
        expect(submissionObj.personalData.address).to.be.an('object');
        expect(submissionObj.personalData.address).haveOwnProperty(
          'addresslineOne',
        );
        expect(submissionObj.personalData.address).haveOwnProperty(
          'addresslineTwo',
        );
        expect(submissionObj.personalData.address).haveOwnProperty(
          'addresslineThree',
        );
        expect(submissionObj.personalData.address).haveOwnProperty('city');
        expect(submissionObj.personalData.address).haveOwnProperty(
          'stateOrProvince',
        );
        expect(submissionObj.personalData.address).haveOwnProperty(
          'zipOrPostalCode',
        );
        expect(submissionObj.personalData.address).haveOwnProperty(
          'countryName',
        );
      });
      it('has valid data', () => {
        const submissionObj = JSON.parse(transform(null, inputObject));
        expect(submissionObj.personalData.address.addresslineOne).to.equal(
          '1200 Park Ave',
        );
        expect(submissionObj.personalData.address.addresslineTwo).to.equal(
          'c/o Pixar',
        );
        expect(submissionObj.personalData.address.addresslineThree).to.equal(
          '',
        );
        expect(submissionObj.personalData.address.city).to.equal('Emeryville');
        expect(submissionObj.personalData.address.stateOrProvince).to.equal(
          'CA',
        );
        expect(submissionObj.personalData.address.zipOrPostalCode).to.equal(
          '94608',
        );
        expect(submissionObj.personalData.address.countryName).to.equal('US');
      });
    });
    describe('efsr-employment history', () => {
      it('has valid structure', () => {
        const submissionObj = JSON.parse(transform(null, inputObject));
        expect(submissionObj).haveOwnProperty('personalData');
        expect(submissionObj.personalData).haveOwnProperty('employmentHistory');
        expect(submissionObj.personalData.employmentHistory).to.be.an('array');
        expect(submissionObj.personalData.employmentHistory[0]).haveOwnProperty(
          'veteranOrSpouse',
        );
        expect(submissionObj.personalData.employmentHistory[0]).haveOwnProperty(
          'occupationName',
        );
        expect(submissionObj.personalData.employmentHistory[0]).haveOwnProperty(
          'from',
        );
        expect(submissionObj.personalData.employmentHistory[0]).haveOwnProperty(
          'to',
        );
        expect(submissionObj.personalData.employmentHistory[0]).haveOwnProperty(
          'present',
        );
        expect(submissionObj.personalData.employmentHistory[0]).haveOwnProperty(
          'employerName',
        );
      });
      it('has valid data', () => {
        const submissionObj = JSON.parse(transform(null, inputObject));
        expect(submissionObj).haveOwnProperty('personalData');
        expect(submissionObj.personalData).haveOwnProperty('employmentHistory');
        expect(submissionObj.personalData.employmentHistory[0]).haveOwnProperty(
          'veteranOrSpouse',
        );
        expect(
          submissionObj.personalData.employmentHistory[0].veteranOrSpouse,
        ).to.equal('VETERAN');
        expect(
          submissionObj.personalData.employmentHistory[0].occupationName,
        ).to.equal('Full time');
        expect(submissionObj.personalData.employmentHistory[0].from).to.equal(
          '01/2017',
        );
        expect(submissionObj.personalData.employmentHistory[0].to).to.equal('');
        expect(
          submissionObj.personalData.employmentHistory[0].present,
        ).to.equal(true);
        expect(
          submissionObj.personalData.employmentHistory[0].employerName,
        ).to.equal('Veteran Current One');
      });
      describe('efsr-employer address', () => {
        it('has valid structure', () => {
          const submissionObj = JSON.parse(transform(null, inputObject));
          expect(submissionObj).haveOwnProperty('personalData');
          expect(submissionObj.personalData).haveOwnProperty(
            'employmentHistory',
          );
          expect(
            submissionObj.personalData.employmentHistory[0],
          ).haveOwnProperty('employerAddress');
          expect(
            submissionObj.personalData.employmentHistory[0].employerAddress,
          ).to.be.an('object');
          expect(
            submissionObj.personalData.employmentHistory[0].employerAddress,
          ).haveOwnProperty('addresslineOne');
          expect(
            submissionObj.personalData.employmentHistory[0].employerAddress,
          ).haveOwnProperty('addresslineTwo');
          expect(
            submissionObj.personalData.employmentHistory[0].employerAddress,
          ).haveOwnProperty('addresslineThree');
          expect(
            submissionObj.personalData.employmentHistory[0].employerAddress,
          ).haveOwnProperty('city');
          expect(
            submissionObj.personalData.employmentHistory[0].employerAddress,
          ).haveOwnProperty('stateOrProvince');
          expect(
            submissionObj.personalData.employmentHistory[0].employerAddress,
          ).haveOwnProperty('zipOrPostalCode');
          expect(
            submissionObj.personalData.employmentHistory[0].employerAddress,
          ).haveOwnProperty('countryName');
        });
        it('has valid data', () => {
          const submissionObj = JSON.parse(transform(null, inputObject));
          expect(
            submissionObj.personalData.employmentHistory[0].employerAddress
              .addresslineOne,
          ).to.equal('');
          expect(
            submissionObj.personalData.employmentHistory[0].employerAddress
              .addresslineTwo,
          ).to.equal('');
          expect(
            submissionObj.personalData.employmentHistory[0].employerAddress
              .addresslineThree,
          ).to.equal('');
          expect(
            submissionObj.personalData.employmentHistory[0].employerAddress
              .city,
          ).to.equal('');
          expect(
            submissionObj.personalData.employmentHistory[0].employerAddress
              .stateOrProvince,
          ).to.equal('');
          expect(
            submissionObj.personalData.employmentHistory[0].employerAddress
              .zipOrPostalCode,
          ).to.equal('');
          expect(
            submissionObj.personalData.employmentHistory[0].employerAddress
              .countryName,
          ).to.equal('');
        });
      });
    });
  });
  describe('efsr-income', () => {
    it('has valid structure', () => {
      const submissionObj = JSON.parse(transform(null, inputObject));
      expect(submissionObj).haveOwnProperty('income');
      expect(submissionObj.income).to.be.an('array');
    });
    describe('efsr-income list object', () => {
      it('has valid structure', () => {
        const submissionObj = JSON.parse(transform(null, inputObject));
        expect(submissionObj).haveOwnProperty('income');
        expect(submissionObj.income[0]).haveOwnProperty('veteranOrSpouse');
        expect(submissionObj.income[0]).haveOwnProperty('monthlyGrossSalary');
        expect(submissionObj.income[0]).haveOwnProperty('deductions');
        expect(submissionObj.income[0].deductions).to.be.an('object');
        expect(submissionObj.income[0]).haveOwnProperty('totalDeductions');
        expect(submissionObj.income[0]).haveOwnProperty('netTakeHomePay');
        expect(submissionObj.income[0]).haveOwnProperty('otherIncome');
        expect(submissionObj.income[0].otherIncome).to.be.an('object');
        expect(submissionObj.income[0]).haveOwnProperty(
          'totalMonthlyNetIncome',
        );
      });
      it('has valid data', () => {
        const submissionObj = JSON.parse(transform(null, inputObject));
        expect(submissionObj.income[0].veteranOrSpouse).to.equal('VETERAN');
        expect(submissionObj.income[0].monthlyGrossSalary).to.equal('7001.10');
        expect(submissionObj.income[0].totalDeductions).to.equal('1392.44');
        expect(submissionObj.income[0].netTakeHomePay).to.equal('5608.66');
        expect(submissionObj.income[0].totalMonthlyNetIncome).to.equal(
          '12621.51',
        );
      });
      describe('efsr-deductions', () => {
        it('has valid structure', () => {
          const submissionObj = JSON.parse(transform(null, inputObject));
          expect(submissionObj.income[0].deductions).haveOwnProperty('taxes');
          expect(submissionObj.income[0].deductions).haveOwnProperty(
            'retirement',
          );
          expect(submissionObj.income[0].deductions).haveOwnProperty(
            'socialSecurity',
          );
          expect(submissionObj.income[0].deductions).haveOwnProperty(
            'otherDeductions',
          );
          expect(submissionObj.income[0].deductions.otherDeductions).to.be.an(
            'object',
          );
        });
        it('has valid data', () => {
          const submissionObj = JSON.parse(transform(null, inputObject));
          expect(submissionObj.income[0].deductions.taxes).to.equal('781.03');
          expect(submissionObj.income[0].deductions.retirement).to.equal(
            '100.00',
          );
          expect(submissionObj.income[0].deductions.socialSecurity).to.equal(
            '122.40',
          );
        });
        describe('efsr-other deductions', () => {
          it('has valid structure', () => {
            const submissionObj = JSON.parse(transform(null, inputObject));
            expect(
              submissionObj.income[0].deductions.otherDeductions,
            ).haveOwnProperty('name');
            expect(
              submissionObj.income[0].deductions.otherDeductions,
            ).haveOwnProperty('amount');
          });
          it('has valid data', () => {
            const submissionObj = JSON.parse(transform(null, inputObject));
            expect(
              submissionObj.income[0].deductions.otherDeductions.name,
            ).to.equal('Health insurance, Allotment');
            expect(
              submissionObj.income[0].deductions.otherDeductions.amount,
            ).to.equal('389.01');
          });
        });
      });
      describe('efsr-otherIncome', () => {
        it('has valid structure', () => {
          const submissionObj = JSON.parse(transform(null, inputObject));
          expect(submissionObj.income[0].otherIncome).haveOwnProperty('name');
          expect(submissionObj.income[0].otherIncome).haveOwnProperty('amount');
        });
        it('has valid data', () => {
          const submissionObj = JSON.parse(transform(null, inputObject));
          expect(submissionObj.income[0].otherIncome.name).to.equal(
            'Disability Compensation, Education, Social Security, Employment bonus, Alimony',
          );
          expect(submissionObj.income[0].otherIncome.amount).to.equal(
            '7012.85',
          );
        });
      });
    });
  });
  describe('efsr-expenses', () => {
    let submissionObj;

    beforeEach(() => {
      submissionObj = JSON.parse(transform(null, inputObject));
    });

    describe('structure validation', () => {
      it('has valid overall structure', () => {
        expect(submissionObj).haveOwnProperty('expenses');
        expect(submissionObj.expenses).to.be.an('object');
        expect(submissionObj.expenses).include.all.keys(
          'rentOrMortgage',
          'food',
          'utilities',
          'otherLivingExpenses',
          'expensesInstallmentContractsAndOtherDebts',
          'totalMonthlyExpenses',
        );
        expect(submissionObj.expenses.otherLivingExpenses).to.be.an('object');
      });

      describe('efsr-other living expenses structure', () => {
        it('has valid structure', () => {
          expect(submissionObj.expenses.otherLivingExpenses).include.all.keys(
            'name',
            'amount',
          );
        });
      });
    });

    describe('data validation', () => {
      it('has valid data for overall expenses', () => {
        expect(submissionObj.expenses.rentOrMortgage).to.equal('2000.53');
        expect(submissionObj.expenses.food).to.equal('1000.54');
        expect(submissionObj.expenses.utilities).to.equal('701.35');
        expect(submissionObj.expenses.otherLivingExpenses.amount).to.equal(
          '195.25',
        );
        expect(
          submissionObj.expenses.expensesInstallmentContractsAndOtherDebts,
        ).to.equal('2000.64');
        expect(submissionObj.expenses.totalMonthlyExpenses).to.equal('5898.31');
      });

      describe('efsr-other living expenses data', () => {
        it('has valid data', () => {
          expect(submissionObj.expenses.otherLivingExpenses.name).to.equal(
            'Clothing, Veteran added, Property tax',
          );
          expect(submissionObj.expenses.otherLivingExpenses.amount).to.equal(
            '195.25',
          );
        });
      });
    });
  });
  describe('efsr-discretionaryIncome', () => {
    it('has valid structure', () => {
      const submissionObj = JSON.parse(transform(null, inputObject));
      expect(submissionObj).haveOwnProperty('discretionaryIncome');
      expect(submissionObj.discretionaryIncome).to.be.an('object');
      expect(submissionObj.discretionaryIncome).haveOwnProperty(
        'netMonthlyIncomeLessExpenses',
      );
      expect(submissionObj.discretionaryIncome).haveOwnProperty(
        'amountCanBePaidTowardDebt',
      );
    });
    it('has valid data', () => {
      const submissionObj = JSON.parse(transform(null, inputObject));
      expect(
        submissionObj.discretionaryIncome.netMonthlyIncomeLessExpenses,
      ).to.equal('15490.05');
      expect(
        submissionObj.discretionaryIncome.amountCanBePaidTowardDebt,
      ).to.equal('61.02');
    });
  });
  describe('efsr-assets', () => {
    it('has valid structure', () => {
      const submissionObj = JSON.parse(transform(null, inputObject));
      expect(submissionObj).haveOwnProperty('assets');
      expect(submissionObj.assets).to.be.an('object');
      expect(submissionObj.assets).haveOwnProperty('cashInBank');
      expect(submissionObj.assets).haveOwnProperty('cashOnHand');
      expect(submissionObj.assets).haveOwnProperty('automobiles');
      expect(submissionObj.assets.automobiles).to.be.an('array');
      expect(submissionObj.assets).haveOwnProperty('trailersBoatsCampers');
      expect(submissionObj.assets).haveOwnProperty('usSavingsBonds');
      expect(submissionObj.assets).haveOwnProperty('stocksAndOtherBonds');
      expect(submissionObj.assets).haveOwnProperty('realEstateOwned');
      expect(submissionObj.assets).haveOwnProperty('otherAssets');
      expect(submissionObj.assets.otherAssets).to.be.an('array');
      expect(submissionObj.assets).haveOwnProperty('totalAssets');
    });
    it('has valid data', () => {
      const submissionObj = JSON.parse(transform(null, inputObject));
      expect(submissionObj.assets.cashInBank).to.equal('3000.45');
      expect(submissionObj.assets.cashOnHand).to.equal('10000.67');
      expect(submissionObj.assets.trailersBoatsCampers).to.equal('15000.23');
      expect(submissionObj.assets.usSavingsBonds).to.equal('25000.65');
      expect(submissionObj.assets.stocksAndOtherBonds).to.equal('50000.84');
      expect(submissionObj.assets.realEstateOwned).to.equal('800000.81');
      expect(submissionObj.assets.totalAssets).to.equal('1034004.98');
    });
    describe('efsr-automobiles', () => {
      it('has valid structure', () => {
        const submissionObj = JSON.parse(transform(null, inputObject));
        expect(submissionObj.assets.automobiles[0]).haveOwnProperty('make');
        expect(submissionObj.assets.automobiles[0]).haveOwnProperty('model');
        expect(submissionObj.assets.automobiles[0]).haveOwnProperty('year');
        expect(submissionObj.assets.automobiles[0]).haveOwnProperty(
          'resaleValue',
        );
      });
      it('has valid data', () => {
        const submissionObj = JSON.parse(transform(null, inputObject));
        expect(submissionObj.assets.automobiles[0].make).to.equal('Dodge');
        expect(submissionObj.assets.automobiles[0].model).to.equal('RAM');
        expect(submissionObj.assets.automobiles[0].year).to.equal('2020');
        expect(submissionObj.assets.automobiles[0].resaleValue).to.equal(
          '75000.45',
        );
      });
    });
    describe('efsr-otherAssets', () => {
      it('has valid structure', () => {
        const submissionObj = JSON.parse(transform(null, inputObject));
        expect(submissionObj.assets.otherAssets[0]).haveOwnProperty('name');
        expect(submissionObj.assets.otherAssets[0]).haveOwnProperty('amount');
      });
      it('has valid data', () => {
        const submissionObj = JSON.parse(transform(null, inputObject));
        expect(submissionObj.assets.otherAssets[0].name).to.equal(
          'Gambling earning',
        );
        expect(submissionObj.assets.otherAssets[0].amount).to.equal('16000.34');
      });
    });
  });
  describe('efsr-installmentContractsAndOtherDebts', () => {
    it('has valid structure', () => {
      const submissionObj = JSON.parse(transform(null, inputObject));
      expect(submissionObj).haveOwnProperty(
        'installmentContractsAndOtherDebts',
      );
      expect(submissionObj.installmentContractsAndOtherDebts).is.an('array');
    });
    describe('efsr-installmentContractsAndOtherDebts list item', () => {
      it('has valid structure', () => {
        const submissionObj = JSON.parse(transform(null, inputObject));
        expect(submissionObj.installmentContractsAndOtherDebts[0]).is.an(
          'object',
        );
        expect(
          submissionObj.installmentContractsAndOtherDebts[0],
        ).haveOwnProperty('purpose');
        expect(
          submissionObj.installmentContractsAndOtherDebts[0],
        ).haveOwnProperty('creditorName');
        expect(
          submissionObj.installmentContractsAndOtherDebts[0],
        ).haveOwnProperty('originalAmount');
        expect(
          submissionObj.installmentContractsAndOtherDebts[0],
        ).haveOwnProperty('unpaidBalance');
        expect(
          submissionObj.installmentContractsAndOtherDebts[0],
        ).haveOwnProperty('amountDueMonthly');
        expect(
          submissionObj.installmentContractsAndOtherDebts[0],
        ).haveOwnProperty('dateStarted');
        expect(
          submissionObj.installmentContractsAndOtherDebts[0],
        ).haveOwnProperty('amountPastDue');
        expect(
          submissionObj.installmentContractsAndOtherDebts[0],
        ).haveOwnProperty('creditorAddress');
        expect(
          submissionObj.installmentContractsAndOtherDebts[0].creditorAddress,
        ).is.an('object');
      });
      it('has valid data', () => {
        const submissionObj = JSON.parse(transform(null, inputObject));
        expect(
          submissionObj.installmentContractsAndOtherDebts[0].purpose,
        ).to.equal('Credit card payments');
        expect(
          submissionObj.installmentContractsAndOtherDebts[0].creditorName,
        ).to.equal('Creditor One');
        expect(
          submissionObj.installmentContractsAndOtherDebts[0].originalAmount,
        ).to.equal('50000.54');
        expect(
          submissionObj.installmentContractsAndOtherDebts[0].unpaidBalance,
        ).to.equal('15000.56');
        expect(
          submissionObj.installmentContractsAndOtherDebts[0].amountDueMonthly,
        ).to.equal('800.10');
        expect(
          submissionObj.installmentContractsAndOtherDebts[0].dateStarted,
        ).to.equal('03/2017');
        expect(
          submissionObj.installmentContractsAndOtherDebts[0].amountPastDue,
        ).to.equal('125.43');
      });
      describe('efsr-creditorAddress', () => {
        it('has valid structure', () => {
          const submissionObj = JSON.parse(transform(null, inputObject));
          expect(
            submissionObj.installmentContractsAndOtherDebts[0].creditorAddress,
          ).haveOwnProperty('addresslineOne');
          expect(
            submissionObj.installmentContractsAndOtherDebts[0].creditorAddress,
          ).haveOwnProperty('addresslineTwo');
          expect(
            submissionObj.installmentContractsAndOtherDebts[0].creditorAddress,
          ).haveOwnProperty('addresslineThree');
          expect(
            submissionObj.installmentContractsAndOtherDebts[0].creditorAddress,
          ).haveOwnProperty('city');
          expect(
            submissionObj.installmentContractsAndOtherDebts[0].creditorAddress,
          ).haveOwnProperty('stateOrProvince');
          expect(
            submissionObj.installmentContractsAndOtherDebts[0].creditorAddress,
          ).haveOwnProperty('zipOrPostalCode');
          expect(
            submissionObj.installmentContractsAndOtherDebts[0].creditorAddress,
          ).haveOwnProperty('countryName');
        });
        it('has valid data', () => {
          const submissionObj = JSON.parse(transform(null, inputObject));
          expect(
            submissionObj.installmentContractsAndOtherDebts[0].creditorAddress
              .addresslineOne,
          ).to.equal('');
          expect(
            submissionObj.installmentContractsAndOtherDebts[0].creditorAddress
              .addresslineTwo,
          ).to.equal('');
          expect(
            submissionObj.installmentContractsAndOtherDebts[0].creditorAddress
              .addresslineThree,
          ).to.equal('');
          expect(
            submissionObj.installmentContractsAndOtherDebts[0].creditorAddress
              .city,
          ).to.equal('');
          expect(
            submissionObj.installmentContractsAndOtherDebts[0].creditorAddress
              .stateOrProvince,
          ).to.equal('');
          expect(
            submissionObj.installmentContractsAndOtherDebts[0].creditorAddress
              .zipOrPostalCode,
          ).to.equal('');
          expect(
            submissionObj.installmentContractsAndOtherDebts[0].creditorAddress
              .countryName,
          ).to.equal('');
        });
      });
    });
  });
  describe('efsr-totalOfInstallmentContractsAndOtherDebts', () => {
    it('has valid structure', () => {
      const submissionObj = JSON.parse(transform(null, inputObject));
      expect(submissionObj).haveOwnProperty(
        'totalOfInstallmentContractsAndOtherDebts',
      );
      expect(submissionObj.totalOfInstallmentContractsAndOtherDebts).to.be.an(
        'object',
      );
      expect(
        submissionObj.totalOfInstallmentContractsAndOtherDebts,
      ).haveOwnProperty('originalAmount');
      expect(
        submissionObj.totalOfInstallmentContractsAndOtherDebts,
      ).haveOwnProperty('unpaidBalance');
      expect(
        submissionObj.totalOfInstallmentContractsAndOtherDebts,
      ).haveOwnProperty('amountDueMonthly');
      expect(
        submissionObj.totalOfInstallmentContractsAndOtherDebts,
      ).haveOwnProperty('amountPastDue');
    });
    it('has valid data', () => {
      const submissionObj = JSON.parse(transform(null, inputObject));
      expect(
        submissionObj.totalOfInstallmentContractsAndOtherDebts.originalAmount,
      ).to.equal('150000.97');
      expect(
        submissionObj.totalOfInstallmentContractsAndOtherDebts.unpaidBalance,
      ).to.equal('65000.82');
      expect(
        submissionObj.totalOfInstallmentContractsAndOtherDebts.amountDueMonthly,
      ).to.equal('2000.64');
      expect(
        submissionObj.totalOfInstallmentContractsAndOtherDebts.amountPastDue,
      ).to.equal('125.43');
    });
  });
  describe('efsr-additionalData', () => {
    it('has valid structure', () => {
      const submissionObj = JSON.parse(transform(null, inputObject));
      expect(submissionObj).haveOwnProperty('additionalData');
      expect(submissionObj.additionalData).to.be.an('object');
      expect(submissionObj.additionalData).haveOwnProperty(
        'additionalComments',
      );
      expect(submissionObj.additionalData).haveOwnProperty('bankruptcy');
      expect(submissionObj.additionalData.bankruptcy).to.be.an('object');
    });
    it('has valid data', () => {
      const submissionObj = JSON.parse(transform(null, inputObject));
      expect(submissionObj.additionalData.additionalComments).to.equal(
        'Supporting personal statement...\nIndividual expense amount: Clothing ($10.00), Veteran added ($100.00), Property tax ($85.25)',
      );
    });
    describe('efsr-bankruptcy', () => {
      it('has valid structure', () => {
        const submissionObj = JSON.parse(transform(null, inputObject));
        expect(submissionObj.additionalData.bankruptcy).haveOwnProperty(
          'hasBeenAdjudicatedBankrupt',
        );
        expect(submissionObj.additionalData.bankruptcy).haveOwnProperty(
          'dateDischarged',
        );
        expect(submissionObj.additionalData.bankruptcy).haveOwnProperty(
          'courtLocation',
        );
        expect(submissionObj.additionalData.bankruptcy).haveOwnProperty(
          'docketNumber',
        );
      });
      it('has valid data', () => {
        const submissionObj = JSON.parse(transform(null, inputObject));
        expect(
          submissionObj.additionalData.bankruptcy.hasBeenAdjudicatedBankrupt,
        ).to.equal(true);
        expect(submissionObj.additionalData.bankruptcy.dateDischarged).to.equal(
          '10/2004',
        );
        expect(submissionObj.additionalData.bankruptcy.courtLocation).to.equal(
          'Tampa, FL',
        );
        expect(submissionObj.additionalData.bankruptcy.docketNumber).to.equal(
          '123456',
        );
      });
    });
  });
  describe('efsr-applicantCertifications', () => {
    it('has valid structure', () => {
      const submissionObj = JSON.parse(transform(null, inputObject));
      expect(submissionObj).haveOwnProperty('applicantCertifications');
      expect(submissionObj.applicantCertifications).to.be.an('object');
      expect(submissionObj.applicantCertifications).haveOwnProperty(
        'veteranSignature',
      );
      expect(submissionObj.applicantCertifications).haveOwnProperty(
        'veteranDateSigned',
      );
    });
    it('has valid data', () => {
      const submissionObj = JSON.parse(transform(null, inputObject));
      expect(submissionObj.applicantCertifications.veteranSignature).to.equal(
        'Greg A Anderson',
      );
      expect(submissionObj.applicantCertifications.veteranDateSigned).to.equal(
        formatDateShort(new Date()),
      );
    });
  });
});
