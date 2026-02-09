import { expect } from 'chai';
import sinon from 'sinon';
import transformForSubmit from '../../../config/submit-transformer';
import * as sharedTransformForSubmit from '../../../../shared/config/submit-transformer';

describe('21-8940 submit transformer', () => {
  const formConfig = { formId: '21-8940', chapters: {} };
  let sharedTransformStub;

  before(() => {
    global.window = global.window || {};
  });

  beforeEach(() => {
    sharedTransformStub = sinon.stub(sharedTransformForSubmit, 'default');
  });

  afterEach(() => {
    sharedTransformStub.restore();
  });

  it('formats and prunes the submission payload', () => {
    const form = {
      data: {
        veteran: {
          fullName: {
            first: '  AlexanderTheGreat  ',
            middle: 'marie',
            last: '  LonglastnameBeyondLimit ',
          },
          ssn: ' 123456789 ',
          vaFileNumber: '  987654321 ',
          dateOfBirth: '1970-05-01',
          address: {
            street: ' 123 Main St ',
            street2: ' Apt 4 ',
            city: ' Springfield ',
            state: ' VA ',
            postalCode: ' 12345 ',
            country: ' united states of america ',
          },
          email: ' vet@example.com ',
          homePhone: {
            callingCode: 1,
            contact: '(555) 000-0000',
            countryCode: 'US',
          },
          alternatePhone: {
            callingCode: 44,
            contact: '20 7946 0958',
            countryCode: 'GB',
          },
        },
        doctorCareQuestion: {
          hasReceivedDoctorCare: true,
          doctorCareType: 'nonVa',
        },
        doctors: [
          {
            doctorName: ' Dr Strange ',
            doctorAddress: {
              street: '177A Bleecker St',
              city: 'New York',
              state: 'NY',
              postalCode: '10012',
              country: 'USA',
            },
            treatmentDates: [
              { startDate: '2019-01-01', endDate: '2019-05-01' },
              { startDate: '2019-06-01', endDate: '2019-08-01' },
            ],
          },
          { doctorName: '  ', doctorAddress: {}, treatmentDates: [] },
        ],
        hospitals: [
          {
            hospitalName: 'General Hospital',
            hospitalAddress: {
              street: '1 Health Way',
              city: 'Boston',
              state: 'MA',
              postalCode: '02118',
              country: 'United States of America',
            },
            connectedDisabilities: ['Chronic back pain'],
            treatmentDates: [
              { startDate: '2018-02-01', endDate: '2018-03-01' },
            ],
          },
        ],
        employersHistory: [
          {
            employerName: ' Mega Corp ',
            employerAddress: {
              street: '200 Industry Rd',
              city: 'Arlington',
              state: 'VA',
              postalCode: '22203',
              country: 'USA',
            },
            typeOfWork: 'Engineering Manager',
            hoursPerWeek: '50',
            startDate: '2016-01-01',
            endDate: '2018-12-12',
            timeLost: '12',
            earnings: '9000',
          },
          { employerName: '', employerAddress: {} },
        ],
        employmentHistory: [
          {
            employerName: 'Future Corp',
            employerAddress: {
              street: '500 Tech Ln',
              city: 'Reston',
              state: 'VA',
              postalCode: '20190',
              country: 'us',
            },
            typeOfWork: 'Product Designer',
            dateApplied: '2023-01-03',
          },
        ],
        employers: [
          {
            employerName: 'Backup Inc',
            employerAddress: {
              street: '700 Backup Rd',
              city: 'Alexandria',
              state: 'VA',
              postalCode: '22314',
              country: 'Canada',
            },
            typeOfWork: 'Consultant',
            dateApplied: '2023-02-10',
          },
        ],
        disabilityDescription: [
          'Chronic back pain',
          { disability: 'PTSD' },
          '   ',
        ],
        disabilityDate: '2020-04-05',
        lastWorkedDate: '2021-07-08',
        disabledWorkDate: '2021-07-09',
        maxYearlyEarnings: '54000',
        yearEarned: '2021345',
        occupation: 'Lead Systems Architect with multiple responsibilities',
        activeDutyOrders: true,
        totalIncome: '1234',
        monthlyIncome: '456',
        leftDueToDisability: false,
        receivesDisabilityRetirement: true,
        receivesWorkersCompensation: true,
        educationLevel: 'college',
        college: 'junior',
        educationBeforeDisability: [
          {
            typeOfEducation: 'Vocational training',
            datesOfTraining: { from: '2010-01-01', to: '2010-06-01' },
          },
          { typeOfEducation: 'Second entry', datesOfTraining: {} },
        ],
        educationAfterDisability: [
          {
            typeOfEducation: 'Technical course',
            datesOfTraining: { from: '2015-01-01', to: '2015-03-01' },
          },
        ],
        additionalRemarks: 'Needs assistance with tasks.',
        signatureOfClaimant: 'AlexanderThe M LonglastnameBeyond',
        dateSigned: '2024-01-01',
        files: [{ name: 'supporting.pdf' }, null, {}],
      },
    };

    sharedTransformStub.callsFake((config, formArg) =>
      JSON.stringify({
        ...formArg.data,
        formNumber: config.formId,
      }),
    );

    const transformedResult = transformForSubmit(formConfig, form);
    const transformed = JSON.parse(transformedResult);

    expect(transformed.formNumber).to.equal('21-8940');
    expect(transformed.increase_compensation_claim).to.have.property('form');

    const payload = JSON.parse(transformed.increase_compensation_claim.form);

    expect(payload.veteranFullName).to.deep.equal({
      first: 'AlexanderThe',
      middleinitial: 'M',
      last: 'LonglastnameBeyond',
    });
    expect(payload.veteranAddress).to.deep.equal({
      street: '123 Main St',
      street2: 'Apt 4',
      city: 'Springfield',
      state: 'VA',
      postalCode: '12345',
      country: 'US',
    });
    expect(payload.electronicCorrespondance).to.be.true;
    expect(payload.email).to.equal('vet@example.com');
    expect(payload.veteranPhone).to.equal('5550000000');
    expect(payload.internationalPhone).to.equal('442079460958');
    expect(payload.listOfDisabilities).to.equal('Chronic back pain, PTSD');
    expect(payload.doctorsCare).to.deep.equal([
      {
        doctorsTreatmentDates: [
          { from: '2019-01-01', to: '2019-05-01' },
          { from: '2019-06-01', to: '2019-08-01' },
        ],
        nameAndAddressOfDoctor:
          'Dr Strange - 177A Bleecker St, New York, NY, 10012, US',
      },
    ]);
    expect(payload.hospitalsCare).to.deep.equal([
      {
        hospitalTreatmentDates: [{ from: '2018-02-01', to: '2018-03-01' }],
        nameAndAddressOfHospital:
          'General Hospital - 1 Health Way, Boston, MA, 02118, US',
      },
    ]);
    expect(payload.occupationDuringMostEarnings).to.equal(
      'Lead Systems Architect with',
    );
    expect(payload.preventMilitaryDuties).to.be.true;
    expect(payload.previousEmployers).to.deep.equal([
      {
        nameAndAddress: 'Mega Corp - 200 Industry Rd, Arlington, VA, 22203, US',
        typeOfWork: 'Engineering Manager',
        hoursPerWeek: 50,
        datesOfEmployment: {
          from: '2016-01-01',
          to: '2018-12-12',
        },
        timeLostFromIllness: 12,
        mostEarningsInAMonth: 9000,
      },
    ]);
    expect(payload.appliedEmployers).to.deep.equal([
      {
        nameAndAddress: 'Future Corp - 500 Tech Ln, Reston, VA, 20190, US',
        typeOfWork: 'Product Designer',
        dateApplied: '2023-01-03',
      },
      {
        nameAndAddress: 'Backup Inc - 700 Backup Rd, Alexandria, VA, 22314, CA',
        typeOfWork: 'Consultant',
        dateApplied: '2023-02-10',
      },
    ]);
    expect(payload.education).to.deep.equal({ college: 'Jr' });
    expect(payload.educationTrainingPreUnemployability).to.deep.equal({
      name: 'Vocational t',
      datesOfTraining: {
        from: '2010-01-01',
        to: '2010-06-01',
      },
    });
    expect(payload.educationTrainingPostUnemployability).to.deep.equal({
      name: 'Technical co',
      datesOfTraining: {
        from: '2015-01-01',
        to: '2015-03-01',
      },
    });
    expect(payload.trainingPreDisabled).to.be.true;
    expect(payload.trainingPostUnemployment).to.be.true;
    expect(payload.mostEarningsInAYear).to.equal(54000);
    expect(payload.yearOfMostEarnings).to.equal(2021);
    expect(payload.past12MonthsEarnedIncome).to.equal(1234);
    expect(payload.currentMonthlyEarnedIncome).to.equal(456);
    expect(payload.leftLastJobDueToDisability).to.be.false;
    expect(payload.expectDisabilityRetirement).to.be.true;
    expect(payload.receiveExpectWorkersCompensation).to.be.true;
    expect(payload.attemptedEmploy).to.be.true;
    expect(payload.remarks).to.equal('Needs assistance with tasks.');
    expect(payload.signature).to.equal('AlexanderThe M LonglastnameBeyond');
    expect(payload.signatureDate).to.equal('2024-01-01');
    expect(payload.files).to.deep.equal([{ name: 'supporting.pdf' }]);
  });

  it('sets attemptedEmploy to true when employment history entries exist but toggle is false', () => {
    const form = {
      data: {
        employmentHistory: {
          hasTriedEmployment: false,
          data: [
            {
              employerName: 'Sample Employer',
              employerAddress: {
                street: '1 Main St',
                city: 'Springfield',
                state: 'VA',
                postalCode: '22150',
                country: 'USA',
              },
              typeOfWork: 'Developer',
              dateApplied: '2024-05-01',
            },
          ],
        },
      },
    };

    sharedTransformStub.callsFake((config, formArg) =>
      JSON.stringify({
        ...formArg.data,
        formNumber: config.formId,
      }),
    );

    const transformedResult = transformForSubmit(formConfig, form);
    const transformed = JSON.parse(transformedResult);
    const payload = JSON.parse(transformed.increase_compensation_claim.form);

    expect(payload.attemptedEmploy).to.be.true;
    expect(payload.appliedEmployers).to.deep.equal([
      {
        nameAndAddress:
          'Sample Employer - 1 Main St, Springfield, VA, 22150, US',
        typeOfWork: 'Developer',
        dateApplied: '2024-05-01',
      },
    ]);
  });

  it('handles training entries provided as objects', () => {
    const form = {
      data: {
        educationBeforeDisability: {
          typeOfEducation: 'Single entry training',
          datesOfTraining: { from: '2011-05-01', to: '2011-09-01' },
        },
        educationAfterDisability: {
          typeOfEducation: 'Post disability course',
          datesOfTraining: { from: '2018-02-01', to: '2018-06-01' },
        },
      },
    };

    sharedTransformStub.callsFake((config, formArg) =>
      JSON.stringify({
        ...formArg.data,
        formNumber: config.formId,
      }),
    );

    const transformedResult = transformForSubmit(formConfig, form);
    const transformed = JSON.parse(transformedResult);
    const payload = JSON.parse(transformed.increase_compensation_claim.form);

    expect(payload.trainingPreDisabled).to.be.true;
    expect(payload.educationTrainingPreUnemployability).to.deep.equal({
      name: 'Single entry',
      datesOfTraining: {
        from: '2011-05-01',
        to: '2011-09-01',
      },
    });
    expect(payload.trainingPostUnemployment).to.be.true;
    expect(payload.educationTrainingPostUnemployability).to.deep.equal({
      name: 'Post disabil',
      datesOfTraining: {
        from: '2018-02-01',
        to: '2018-06-01',
      },
    });
  });
});
