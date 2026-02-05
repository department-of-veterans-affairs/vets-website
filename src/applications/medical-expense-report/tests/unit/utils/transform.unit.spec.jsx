import { expect } from 'chai';
import sinon from 'sinon';
import * as transformHelpers from 'platform/forms-system/src/js/helpers';
import { transform } from '../../../config/submit-transformer';

describe('submit transformer', () => {
  let transformForSubmitStub;
  beforeEach(() => {
    transformForSubmitStub = sinon
      .stub(transformHelpers, 'transformForSubmit')
      .callsFake((formConfig, form) => {
        return JSON.stringify({
          ...form,
        });
      });
  });

  afterEach(() => {
    transformForSubmitStub.restore();
  });
  it('should transform form data correctly for submission as veteran', () => {
    const formConfig = {}; // Mock form config if needed
    const formData = {
      claimantNotVeteran: false,
      claimantFullName: {
        first: 'John',
        middle: 'A',
        last: 'Doe',
        suffix: 'Jr',
      },
      veteranFullName: {
        first: '',
        middle: '',
        last: '',
        suffix: '',
      },
    };

    const result = transform(formConfig, formData);
    const parsedResult = JSON.parse(result);
    const parsedForm = JSON.parse(parsedResult.medicalExpenseReportsClaim.form);
    expect(parsedResult).to.have.property('medicalExpenseReportsClaim');
    expect(parsedResult.medicalExpenseReportsClaim).to.have.property('form');
    expect(parsedForm).to.deep.equal({
      claimantNotVeteran: false,
      veteranFullName: {
        first: 'John',
        middle: 'A',
        last: 'Doe',
        suffix: 'Jr',
      },
    });
    expect(parsedResult).to.have.property('localTime');
  });
  it('should transform form data correctly for submission as not veteran', () => {
    const formConfig = {}; // Mock form config if needed
    const formData = {
      claimantNotVeteran: true,
      claimantFullName: {
        first: 'John',
        middle: 'A',
        last: 'Doe',
        suffix: 'Jr',
      },
      veteranFullName: {
        first: 'Jane',
        middle: 'C',
        last: 'Doee',
        suffix: 'Sr',
      },
    };

    const result = transform(formConfig, formData);
    const parsedResult = JSON.parse(result);
    const parsedForm = JSON.parse(parsedResult.medicalExpenseReportsClaim.form);
    expect(parsedResult).to.have.property('medicalExpenseReportsClaim');
    expect(parsedResult.medicalExpenseReportsClaim).to.have.property('form');
    expect(parsedForm).to.deep.equal({
      claimantNotVeteran: true,
      claimantFullName: {
        first: 'John',
        middle: 'A',
        last: 'Doe',
        suffix: 'Jr',
      },
      veteranFullName: {
        first: 'Jane',
        middle: 'C',
        last: 'Doee',
        suffix: 'Sr',
      },
    });
    expect(parsedResult).to.have.property('localTime');
  });

  it('should transform recipient and traveler names correctly for submission', () => {
    const formConfig = {};
    const formData = {
      claimantNotVeteran: true,
      careExpenses: [
        {
          recipient: 'VETERAN',
          provider: 'Dr. Smith',
          typeOfCare: 'RESIDENTIAL',
          monthlyAmount: 100,
        },
        {
          recipient: 'DEPENDENT',
          fullNameRecipient: 'Baby Doe',
          provider: 'Dr. Jones',
          typeOfCare: 'IN_HOME_CARE_ATTENDANT',
          monthlyAmount: 200,
        },
      ],
      medicalExpenses: [
        {
          recipient: 'SPOUSE',
          provider: 'Hospital A',
          paymentAmount: 500,
        },
        {
          recipient: 'OTHER',
          fullNameRecipient: 'Jane Smith',
          provider: 'Hospital B',
          paymentAmount: 750,
        },
      ],
      mileageExpenses: [
        {
          traveler: 'VETERAN',
          travelLocation: 'HOSPITAL',
          travelMilesTraveled: '10',
        },
        {
          traveler: 'DEPENDENT',
          fullNameTraveler: 'Tom Otherson',
          travelLocation: 'OTHER',
          travelMilesTraveled: '20',
        },
      ],
    };

    const result = transform(formConfig, formData);
    const parsedResult = JSON.parse(result);
    const parsedForm = JSON.parse(parsedResult.medicalExpenseReportsClaim.form);

    // Check careExpenses
    expect(parsedForm.careExpenses[0]).to.not.have.property('recipientName');
    expect(parsedForm.careExpenses[1]).to.have.property(
      'recipientName',
      'Baby Doe',
    );
    expect(parsedForm.careExpenses[1]).to.not.have.property(
      'fullNameRecipient',
    );

    // Check medicalExpenses
    expect(parsedForm.medicalExpenses[0]).to.not.have.property('recipientName');
    expect(parsedForm.medicalExpenses[1]).to.have.property(
      'recipientName',
      'Jane Smith',
    );
    expect(parsedForm.medicalExpenses[1]).to.not.have.property(
      'fullNameRecipient',
    );

    // Check mileageExpenses
    expect(parsedForm.mileageExpenses[0]).to.not.have.property('travelerName');
    expect(parsedForm.mileageExpenses[1]).to.have.property(
      'travelerName',
      'Tom Otherson',
    );
    expect(parsedForm.mileageExpenses[1]).to.not.have.property(
      'fullNameTraveler',
    );
  });
  it('should split SSN number correctly', () => {
    const formConfig = {}; // Mock form config if needed
    const formData = {
      veteranSocialSecurityNumber: {
        ssn: '123-45-6789',
        vaFileNumber: '987654321',
      },
    };

    const result = transform(formConfig, formData);
    const parsedResult = JSON.parse(result);
    const parsedForm = JSON.parse(parsedResult.medicalExpenseReportsClaim.form);
    expect(parsedResult).to.have.property('medicalExpenseReportsClaim');
    expect(parsedResult.medicalExpenseReportsClaim).to.have.property('form');
    expect(parsedForm).to.deep.equal({
      veteranSocialSecurityNumber: '123-45-6789',
      vaFileNumber: '987654321',
    });
    expect(parsedResult).to.have.property('localTime');
  });
  it('should split VA File number correctly', () => {
    const formConfig = {}; // Mock form config if needed
    const formData = {
      veteranSocialSecurityNumber: {
        vaFileNumber: '987654321',
      },
    };

    const result = transform(formConfig, formData);
    const parsedResult = JSON.parse(result);
    const parsedForm = JSON.parse(parsedResult.medicalExpenseReportsClaim.form);
    expect(parsedResult).to.have.property('medicalExpenseReportsClaim');
    expect(parsedResult.medicalExpenseReportsClaim).to.have.property('form');
    expect(parsedForm).to.deep.equal({
      vaFileNumber: '987654321',
    });
    expect(parsedResult).to.have.property('localTime');
  });
  it('should transform international phone number correctly', () => {
    const formConfig = {}; // Mock form config if needed
    const formData = {
      primaryPhone: {
        countryCode: 'CA',
        callingCode: '1',
        contact: '4165551234',
      },
    };

    const result = transform(formConfig, formData);
    const parsedResult = JSON.parse(result);
    const parsedForm = JSON.parse(parsedResult.medicalExpenseReportsClaim.form);
    expect(parsedResult).to.have.property('medicalExpenseReportsClaim');
    expect(parsedResult.medicalExpenseReportsClaim).to.have.property('form');
    expect(parsedForm).to.deep.equal({
      primaryPhone: {
        countryCode: 'CA',
        callingCode: '1',
        contact: '+1-4165551234',
      },
    });
    expect(parsedResult).to.have.property('localTime');
  });
  it('should rename expense conditional fields correctly', () => {
    const formConfig = {};
    const formData = {
      careExpenses: [
        {
          recipient: 'CHILD',
          fullNameRecipient: 'Baby Doe',
          provider: 'Dr. Jones',
          typeOfCare: 'IN_HOME_CARE_ATTENDANT',
          monthlyAmount: 200,
        },
      ],
      medicalExpenses: [
        {
          recipient: 'OTHER',
          fullNameRecipient: 'Jane Smith',
          provider: 'Hospital B',
          paymentAmount: 750,
        },
      ],
      mileageExpenses: [
        {
          traveler: 'OTHER',
          fullNameTraveler: 'Tom Otherson',
          travelLocation: 'OTHER',
          travelMilesTraveled: '20',
        },
      ],
    };

    const result = transform(formConfig, formData);
    const parsedResult = JSON.parse(result);
    const parsedForm = JSON.parse(parsedResult.medicalExpenseReportsClaim.form);

    // Check careExpenses
    expect(parsedForm.careExpenses[0]).to.have.property(
      'recipientName',
      'Baby Doe',
    );
    expect(parsedForm.careExpenses[0]).to.not.have.property(
      'fullNameRecipient',
    );

    // Check medicalExpenses
    expect(parsedForm.medicalExpenses[0]).to.have.property(
      'recipientName',
      'Jane Smith',
    );
    expect(parsedForm.medicalExpenses[0]).to.not.have.property(
      'fullNameRecipient',
    );
    // Check mileageExpenses
    expect(parsedForm.mileageExpenses[0]).to.have.property(
      'travelerName',
      'Tom Otherson',
    );
    expect(parsedForm.mileageExpenses[0]).to.not.have.property(
      'fullNameTraveler',
    );
  });
});
