import { expect } from 'chai';
import { transform } from '../../../config/submit-transformer';
import simpleData from '../../e2e/fixtures/data/simple-test.json';
import maximalData from '../../e2e/fixtures/data/maximal-test.json';
import overflowData from '../../e2e/fixtures/data/overflow-test.json';

describe('submit-transformer', () => {
  it('should remove medicalCondition when socialSecurityDisability is true', () => {
    const form = {
      data: {
        socialSecurityDisability: true,
        medicalCondition: false,
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.not.have.property('medicalCondition');
  });
  it('should not remove medicalCondition when socialSecurityDisability is false', () => {
    const form = {
      data: {
        socialSecurityDisability: false,
        medicalCondition: false,
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.have.property('medicalCondition');
  });
  it('should remove medicaidCoverage when nursingHome is false', () => {
    const form = {
      data: {
        nursingHome: false,
        medicaidCoverage: false,
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.not.have.property('medicaidCoverage');
  });
  it('should not remove medicaidCoverage when nursingHome is true', () => {
    const form = {
      data: { nursingHome: true, medicaidCoverage: false },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.have.property('medicaidCoverage');
  });
  it('should remove medicaidStatus when medicaidCoverage is true', () => {
    const form = {
      data: {
        nursingHome: true,
        medicaidCoverage: true,
        medicaidStatus: true,
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.not.have.property('medicaidStatus');
  });
  it('should not remove medicaidStatus when medicaidCoverage is false', () => {
    const form = {
      data: {
        nursingHome: true,
        medicaidCoverage: false,
        medicaidStatus: true,
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.have.property('medicaidStatus');
  });
  it('should remove vaMedicalCenters when vaTreatmentHistory is false', () => {
    const form = {
      data: {
        vaTreatmentHistory: false,
        vaMedicalCenters: [{}],
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.not.have.property('vaMedicalCenters');
  });
  it('should not remove vaMedicalCenters when vaTreatmentHistory is true', () => {
    const form = {
      data: {
        vaTreatmentHistory: true,
        vaMedicalCenters: [{}],
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.have.property('vaMedicalCenters');
  });
  it('should remove federalMedicalCenters when federalTreatmentHistory is false', () => {
    const form = {
      data: {
        federalTreatmentHistory: false,
        federalMedicalCenters: [{}],
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.not.have.property('federalMedicalCenters');
  });
  it('should not remove federalMedicalCenters when federalTreatmentHistory is true', () => {
    const form = {
      data: {
        federalTreatmentHistory: true,
        federalMedicalCenters: [{}],
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.have.property('federalMedicalCenters');
  });
  it('should remove employment history when veteran is over 65', () => {
    const form = {
      data: {
        veteranDateOfBirth: '1950-01-01',
        isOver65: true,
        currentEmployment: true,
        currentEmployers: [{}],
        previousEmployers: [{}],
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.not.have.property('currentEmployment');
    expect(transformedData.data).to.not.have.property('currentEmployers');
    expect(transformedData.data).to.not.have.property('previousEmployers');
  });
  it('should transform data when unemployed under 65', () => {
    const form = {
      data: {
        veteranDatOfBirth: '1979-01-01',
        currentEmployment: false,
        currentEmployers: [{}],
        previousEmployers: [{}],
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.not.have.property('currentEmployers');
    expect(transformedData.data).to.have.property('previousEmployers');
  });
  it('should transform data when employed under 65', () => {
    const form = {
      data: {
        veteranDatOfBirth: '1979-01-01',
        currentEmployment: true,
        currentEmployers: [{}],
        previousEmployers: [{}],
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.have.property('currentEmployers');
    expect(transformedData.data).to.not.have.property('previousEmployers');
  });
  it('should transform data when maritalStatus is married', () => {
    const form = {
      data: {
        maritalStatus: 'Married',
        marriages: [{}],
        spouseDateOfBirth: '1960-01-01',
        spouseSocialSecurityNumber: '342342444',
        spouseIsVeteran: true,
        spouseVaFileNumber: '23423444',
        'view:liveWithSpouse': false,
        spouseAddress: {},
        reasonForCurrentSeparation: 'OTHER',
        otherExplanation: 'Personal reason',
        currentSpouseMonthlySupport: 2444,
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.have.property('marriages');
    expect(transformedData.data).to.have.property('spouseDateOfBirth');
    expect(transformedData.data).to.have.property('spouseSocialSecurityNumber');
    expect(transformedData.data).to.have.property('spouseIsVeteran');
    expect(transformedData.data).to.have.property('spouseVaFileNumber');
    expect(transformedData.data).to.not.have.property(
      'reasonForCurrentSeparation',
    );
    expect(transformedData.data).to.not.have.property('otherExplanation');
    expect(transformedData.data).to.not.have.property(
      'currentSpouseMonthlySupport',
    );
  });
  it('should transform data when maritalStatus is divorced', () => {
    const form = {
      data: {
        maritalStatus: 'Divorced',
        marriages: [{}],
        spouseDateOfBirth: '1960-01-01',
        spouseSocialSecurityNumber: '342342444',
        spouseIsVeteran: true,
        spouseVaFileNumber: '23423444',
        'view:liveWithSpouse': false,
        spouseAddress: {},
        reasonForCurrentSeparation: 'OTHER',
        otherExplanation: 'Personal reason',
        currentSpouseMonthlySupport: 2444,
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.not.have.property('marriages');
    expect(transformedData.data).to.not.have.property('spouseDateOfBirth');
    expect(transformedData.data).to.not.have.property(
      'spouseSocialSecurityNumber',
    );
    expect(transformedData.data).to.not.have.property('spouseIsVeteran');
    expect(transformedData.data).to.not.have.property('spouseVaFileNumber');
    expect(transformedData.data).to.not.have.property(
      'reasonForCurrentSeparation',
    );
    expect(transformedData.data).to.not.have.property('otherExplanation');
    expect(transformedData.data).to.not.have.property(
      'currentSpouseMonthlySupport',
    );
  });
  it('should transform data when maritalStatus is widowed', () => {
    const form = {
      data: {
        maritalStatus: 'Widowed',
        marriages: [{}],
        spouseDateOfBirth: '1960-01-01',
        spouseSocialSecurityNumber: '342342444',
        spouseIsVeteran: true,
        spouseVaFileNumber: '23423444',
        'view:liveWithSpouse': false,
        spouseAddress: {},
        reasonForCurrentSeparation: 'OTHER',
        otherExplanation: 'Personal reason',
        currentSpouseMonthlySupport: 2444,
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.not.have.property('marriages');
    expect(transformedData.data).to.not.have.property('spouseDateOfBirth');
    expect(transformedData.data).to.not.have.property(
      'spouseSocialSecurityNumber',
    );
    expect(transformedData.data).to.not.have.property('spouseIsVeteran');
    expect(transformedData.data).to.not.have.property('spouseVaFileNumber');
    expect(transformedData.data).to.not.have.property(
      'reasonForCurrentSeparation',
    );
    expect(transformedData.data).to.not.have.property('otherExplanation');
    expect(transformedData.data).to.not.have.property(
      'currentSpouseMonthlySupport',
    );
  });
  it('should transform data when maritalStatus is never married', () => {
    const form = {
      data: {
        maritalStatus: 'Never married',
        marriages: [{}],
        spouseDateOfBirth: '1960-01-01',
        spouseSocialSecurityNumber: '342342444',
        spouseIsVeteran: true,
        spouseVaFileNumber: '23423444',
        'view:liveWithSpouse': false,
        spouseAddress: {},
        reasonForCurrentSeparation: 'OTHER',
        otherExplanation: 'Personal reason',
        currentSpouseMonthlySupport: 2444,
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.not.have.property('marriages');
    expect(transformedData.data).to.not.have.property('spouseDateOfBirth');
    expect(transformedData.data).to.not.have.property(
      'spouseSocialSecurityNumber',
    );
    expect(transformedData.data).to.not.have.property('spouseIsVeteran');
    expect(transformedData.data).to.not.have.property('spouseVaFileNumber');
    expect(transformedData.data).to.not.have.property(
      'reasonForCurrentSeparation',
    );
    expect(transformedData.data).to.not.have.property('otherExplanation');
    expect(transformedData.data).to.not.have.property(
      'currentSpouseMonthlySupport',
    );
  });
  it('should not transform data when maritalStatus is separated', () => {
    const form = {
      data: {
        maritalStatus: 'Separated',
        marriages: [{}],
        spouseDateOfBirth: '1960-01-01',
        spouseSocialSecurityNumber: '342342444',
        spouseIsVeteran: true,
        spouseVaFileNumber: '23423444',
        'view:liveWithSpouse': false,
        spouseAddress: {},
        reasonForCurrentSeparation: 'OTHER',
        otherExplanation: 'Personal reason',
        currentSpouseMonthlySupport: 2444,
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.have.property('marriages');
    expect(transformedData.data).to.have.property('spouseDateOfBirth');
    expect(transformedData.data).to.have.property('spouseSocialSecurityNumber');
    expect(transformedData.data).to.have.property('spouseIsVeteran');
    expect(transformedData.data).to.have.property('spouseVaFileNumber');
    expect(transformedData.data).to.have.property('reasonForCurrentSeparation');
    expect(transformedData.data).to.have.property('otherExplanation');
    expect(transformedData.data).to.have.property(
      'currentSpouseMonthlySupport',
    );
  });
  it('should remove spouseMarriages when currentSpouseMaritalHistory is false', () => {
    const form = {
      data: {
        currentSpouseMaritalHistory: false,
        spouseMarriages: [{}],
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.not.have.property('spouseMarriages');
  });
  it('should not remove spouseMarriages when currentSpouseMaritalHistory is true', () => {
    const form = {
      data: {
        maritalStatus: 'Married',
        currentSpouseMaritalHistory: 'Yes',
        spouseMarriages: [{}],
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.have.property('spouseMarriages');
  });
  it('should remove dependents when hasDependents is false', () => {
    const form = {
      data: {
        'view:hasDependents': false,
        dependents: [{}],
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.not.have.property('dependents');
  });
  it('should not remove dependents when hasDependents is true', () => {
    const form = {
      data: {
        'view:hasDependents': true,
        dependents: [{}],
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.have.property('dependents');
  });
  it('should remove netWorthEstimation when totalNetWorth is true', () => {
    const form = {
      data: {
        totalNetWorth: true,
        netWorthEstimation: 18000,
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.not.have.property('netWorthEstimation');
  });
  it('should not remove netWorthEstimation when totalNetWorth is false', () => {
    const form = {
      data: {
        totalNetWorth: false,
        netWorthEstimation: 18000,
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.have.property('netWorthEstimation');
  });
  it('should remove homeAcreageMoreThanTwo when homeOwnership is false', () => {
    const form = {
      data: {
        homeOwnership: false,
        homeAcreageMoreThanTwo: true,
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.not.have.property('homeAcreageMoreThanTwo');
  });
  it('should not remove homeAcreageMoreThanTwo when homeOwnership is true', () => {
    const form = {
      data: {
        homeOwnership: true,
        homeAcreageMoreThanTwo: true,
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.have.property('homeAcreageMoreThanTwo');
  });
  it('should remove homeAcreageValue and landMarketable when homeAcreageMoreThanTwo is false', () => {
    const form = {
      data: {
        homeOwnership: true,
        homeAcreageMoreThanTwo: false,
        homeAcreageValue: 500000,
        landMarketable: false,
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.not.have.property('homeAcreageValue');
    expect(transformedData.data).to.not.have.property('landMarketable');
  });
  it('should not remove homeAcreageValue and landMarketable when homeAcreageMoreThanTwo is true', () => {
    const form = {
      data: {
        homeOwnership: true,
        homeAcreageMoreThanTwo: true,
        homeAcreageValue: 500000,
        landMarketable: false,
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.have.property('homeAcreageValue');
    expect(transformedData.data).to.have.property('landMarketable');
  });
  it('should remove incomeSources when receivesIncome is false', () => {
    const form = {
      data: {
        receivesIncome: false,
        incomeSources: [{}],
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.not.have.property('incomeSources');
  });
  it('should not remove incomeSources when receivesIncome is true', () => {
    const form = {
      data: {
        receivesIncome: true,
        incomeSources: [{}],
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.have.property('incomeSources');
  });
  it('should remove careExpenses when hasCareExpenses is false', () => {
    const form = {
      data: {
        hasCareExpenses: false,
        careExpenses: [{}],
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.not.have.property('careExpenses');
  });
  it('should not remove careExpenses when hasCareExpenses is true', () => {
    const form = {
      data: {
        hasCareExpenses: true,
        careExpenses: [{}],
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.have.property('careExpenses');
  });
  it('should remove medicalExpenses when hasMedicalExpenses is false', () => {
    const form = {
      data: {
        hasMedicalExpenses: false,
        medicalExpenses: [{}],
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.not.have.property('medicalExpenses');
  });
  it('should not remove medicalExpenses when hasMedicalExpenses is true', () => {
    const form = {
      data: {
        hasMedicalExpenses: true,
        medicalExpenses: [{}],
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.have.property('medicalExpenses');
  });

  it('should not transform data with simple test data', () => {
    const form = {
      data: {
        ...simpleData.data,
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.have.property('specialMonthlyPension');
    expect(transformedData.data).to.not.have.property('vaMedicalCenters');
    expect(transformedData.data).to.not.have.property('federalMedicalCenters');
    expect(transformedData.data).to.not.have.property('currentEmployers');
    expect(transformedData.data).to.not.have.property('marriages');
    expect(transformedData.data).to.not.have.property('spouseDateOfBirth');
    expect(transformedData.data).to.not.have.property(
      'spouseSocialSecurityNumber',
    );
    expect(transformedData.data).to.not.have.property('spouseIsVeteran');
    expect(transformedData.data).to.not.have.property('spouseVaFileNumber');
    expect(transformedData.data).to.not.have.property('spouseAddress');
    expect(transformedData.data).to.not.have.property(
      'reasonForCurrentSeparation',
    );
    expect(transformedData.data).to.not.have.property('otherExplanation');
    expect(transformedData.data).to.not.have.property(
      'currentSpouseMonthlySupport',
    );
    expect(transformedData.data).to.not.have.property('spouseMarriages');
    expect(transformedData.data).to.not.have.property('dependents');
    expect(transformedData.data).to.not.have.property('careExpenses');
    expect(transformedData.data).to.not.have.property('medicalExpenses');
    expect(transformedData.data).to.not.have.property('homeAcreageMoreThanTwo');
    expect(transformedData.data).to.not.have.property('homeAcreageValue');
    expect(transformedData.data).to.not.have.property('landMarketable');
    expect(transformedData.data).to.not.have.property('incomeSources');
  });

  it('should not transform data with maximal test data', () => {
    const form = {
      data: {
        ...maximalData.data,
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.have.property('medicaidCoverage');
    expect(transformedData.data).to.have.property('medicaidStatus');
    expect(transformedData.data).to.have.property('specialMonthlyPension');
    expect(transformedData.data).to.have.property('vaMedicalCenters');
    expect(transformedData.data).to.have.property('federalMedicalCenters');
    expect(transformedData.data).to.have.property('currentEmployers');
    expect(transformedData.data).to.have.property('marriages');
    expect(transformedData.data).to.have.property('spouseDateOfBirth');
    expect(transformedData.data).to.have.property('spouseSocialSecurityNumber');
    expect(transformedData.data).to.have.property('spouseIsVeteran');
    expect(transformedData.data).to.have.property('spouseVaFileNumber');
    expect(transformedData.data).to.have.property('spouseAddress');
    expect(transformedData.data).to.have.property('reasonForCurrentSeparation');
    expect(transformedData.data).to.have.property('otherExplanation');
    expect(transformedData.data).to.have.property(
      'currentSpouseMonthlySupport',
    );
    expect(transformedData.data).to.have.property('spouseMarriages');
    expect(transformedData.data).to.have.property('dependents');
    expect(transformedData.data).to.have.property('careExpenses');
    expect(transformedData.data).to.have.property('medicalExpenses');
    expect(transformedData.data).to.have.property('homeAcreageMoreThanTwo');
    expect(transformedData.data).to.have.property('homeAcreageValue');
    expect(transformedData.data).to.have.property('landMarketable');
    expect(transformedData.data).to.have.property('incomeSources');
  });

  it('should not transform data with overflow test data', () => {
    const form = {
      data: {
        ...overflowData.data,
      },
    };
    const result = transform({}, { data: form });
    const transformedData = JSON.parse(result);

    expect(transformedData.data).to.have.property('specialMonthlyPension');
    expect(transformedData.data).to.have.property('vaMedicalCenters');
    expect(transformedData.data).to.have.property('federalMedicalCenters');
    expect(transformedData.data).to.have.property('currentEmployers');
    expect(transformedData.data).to.have.property('marriages');
    expect(transformedData.data).to.have.property('spouseDateOfBirth');
    expect(transformedData.data).to.have.property('spouseSocialSecurityNumber');
    expect(transformedData.data).to.have.property('spouseIsVeteran');
    expect(transformedData.data).to.have.property('spouseVaFileNumber');
    expect(transformedData.data).to.have.property('spouseAddress');
    expect(transformedData.data).to.have.property('reasonForCurrentSeparation');
    expect(transformedData.data).to.have.property('otherExplanation');
    expect(transformedData.data).to.have.property(
      'currentSpouseMonthlySupport',
    );
    expect(transformedData.data).to.have.property('spouseMarriages');
    expect(transformedData.data).to.have.property('dependents');
    expect(transformedData.data).to.have.property('careExpenses');
    expect(transformedData.data).to.have.property('medicalExpenses');
    expect(transformedData.data).to.have.property('homeAcreageMoreThanTwo');
    expect(transformedData.data).to.have.property('homeAcreageValue');
    expect(transformedData.data).to.have.property('landMarketable');
    expect(transformedData.data).to.have.property('incomeSources');
  });
});
