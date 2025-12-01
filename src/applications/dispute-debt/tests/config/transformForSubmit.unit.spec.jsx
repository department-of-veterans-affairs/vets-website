import { expect } from 'chai';
import transformForSubmit from '../../config/transformForSubmit';

describe('transformForSubmit', () => {
  const mockFormConfig = {};

  const mockForm = {
    data: {
      veteran: {
        dateOfBirth: '1990-01-01',
        email: 'test@example.com',
        ssn: '123456789',
        fileNumber: '987654321',
        fullName: {
          first: 'John',
          middle: 'M',
          last: 'Doe',
          suffix: 'Jr',
        },
        mailingAddress: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          postalCode: '12345',
        },
        mobilePhone: {
          areaCode: '555',
          phoneNumber: '1234567',
        },
      },
      selectedDebts: [
        {
          id: '1',
          deductionCode: '30', // Comp & Pen
          amount: 1000,
          reason: 'Test reason 1',
          compositeDebtId: '30100',
          originalAr: 1000,
          currentAr: 1000,
          benefitType: 'Comp & Pen',
          disputeReason: "I don't think I owe this debt to VA",
        },
        {
          id: '2',
          deductionCode: '44', // Education
          amount: 2000,
          reason: 'Test reason 2',
          compositeDebtId: '44200',
          originalAr: 2000,
          currentAr: 2000,
          benefitType: 'Chapter 33',
          disputeReason: "I don't think I owe this debt to VA",
        },
        {
          id: '3',
          deductionCode: '71', // Education
          amount: 1500,
          reason: 'Test reason 3',
          compositeDebtId: '71300',
          originalAr: 1500,
          currentAr: 1500,
          benefitType: 'Chapter 34',
          disputeReason: "I don't think I owe this debt to VA",
        },
      ],
    },
  };

  it('is a function', () => {
    expect(transformForSubmit).to.be.a('function');
  });

  it('transforms form data correctly', () => {
    const result = transformForSubmit(mockFormConfig, mockForm);

    expect(result).to.be.an('object');
    expect(result.education).to.exist;
    expect(result.compAndPen).to.exist;
    expect(result.metadata).to.exist;
  });

  it('separates education and comp & pen debts correctly', () => {
    const result = transformForSubmit(mockFormConfig, mockForm);

    // Comp & Pen debt (deductionCode === '30')
    expect(result.compAndPen.selectedDebts).to.have.length(1);
    expect(result.compAndPen.selectedDebts[0].deductionCode).to.equal('30');

    // Education debts (deductionCode !== '30')
    expect(result.education.selectedDebts).to.have.length(2);
    expect(result.education.selectedDebts[0].deductionCode).to.equal('44');
    expect(result.education.selectedDebts[1].deductionCode).to.equal('71');
  });

  it('includes metadata with dispute information', () => {
    const result = transformForSubmit(mockFormConfig, mockForm);

    expect(result.metadata).to.exist;
    expect(result.metadata.disputes).to.be.an('array');
    expect(result.metadata.disputes).to.have.length(3);

    expect(result.metadata.disputes[0]).to.have.property(
      'composite_debt_id',
      '30100',
    );
    expect(result.metadata.disputes[0]).to.have.property(
      'deduction_code',
      '30',
    );
    expect(result.metadata.disputes[0]).to.have.property('original_ar', 1000);
    expect(result.metadata.disputes[0]).to.have.property('current_ar', 1000);
    expect(result.metadata.disputes[0]).to.have.property(
      'benefit_type',
      'Comp & Pen',
    );
    expect(result.metadata.disputes[0]).to.have.property(
      'dispute_reason',
      "I don't think I owe this debt to VA",
    );

    result.metadata.disputes.forEach(dispute => {
      expect(dispute).to.have.all.keys(
        'composite_debt_id',
        'deduction_code',
        'original_ar',
        'current_ar',
        'benefit_type',
        'dispute_reason',
        'rcvbl_id',
      );
    });
  });

  it('formats veteran information correctly', () => {
    const result = transformForSubmit(mockFormConfig, mockForm);

    const veteranInfo = result.education.veteran;
    expect(veteranInfo.dob).to.equal('1990-01-01');
    expect(veteranInfo.email).to.equal('test@example.com');
    expect(veteranInfo.ssnLastFour).to.equal('123456789');
    expect(veteranInfo.vaFileLastFour).to.equal('987654321');

    expect(veteranInfo.veteranFullName.first).to.equal('John');
    expect(veteranInfo.veteranFullName.middle).to.equal('M');
    expect(veteranInfo.veteranFullName.last).to.equal('Doe');
    expect(veteranInfo.veteranFullName.suffix).to.equal('Jr');

    expect(veteranInfo.mailingAddress.street).to.equal('123 Main St');
    expect(veteranInfo.mailingAddress.city).to.equal('Anytown');
    expect(veteranInfo.mailingAddress.state).to.equal('CA');
    expect(veteranInfo.mailingAddress.postalCode).to.equal('12345');

    expect(veteranInfo.mobilePhone.areaCode).to.equal('555');
    expect(veteranInfo.mobilePhone.phoneNumber).to.equal('1234567');
  });

  it('includes submission details with timestamp', () => {
    const beforeTime = new Date();
    const result = transformForSubmit(mockFormConfig, mockForm);
    const afterTime = new Date();

    expect(result.education.submissionDetails.submissionDateTime).to.exist;
    const submissionTime = new Date(
      result.education.submissionDetails.submissionDateTime,
    );
    expect(submissionTime.getTime()).to.be.at.least(beforeTime.getTime());
    expect(submissionTime.getTime()).to.be.at.most(afterTime.getTime());
  });

  it('handles form with only education debts', () => {
    const educationOnlyForm = {
      data: {
        ...mockForm.data,
        selectedDebts: [
          {
            id: '1',
            deductionCode: '44', // Education
            amount: 1000,
            compositeDebtId: '44100',
            originalAr: 1000,
            currentAr: 1000,
            benefitType: 'Chapter 35',
            disputeReason: "I don't think I owe this debt to VA",
          },
        ],
      },
    };

    const result = transformForSubmit(mockFormConfig, educationOnlyForm);

    expect(result.education).to.exist;
    expect(result.education.selectedDebts).to.have.length(1);
    expect(result.compAndPen).to.be.null;
  });

  it('handles form with only comp & pen debts', () => {
    const compPenOnlyForm = {
      data: {
        ...mockForm.data,
        selectedDebts: [
          {
            id: '1',
            deductionCode: '30', // Comp & Pen
            amount: 1000,
            compositeDebtId: '30100',
            originalAr: 1000,
            currentAr: 1000,
            benefitType: 'Comp & Pen',
            disputeReason: "I don't think I owe this debt to VA",
          },
        ],
      },
    };

    const result = transformForSubmit(mockFormConfig, compPenOnlyForm);

    expect(result.compAndPen).to.exist;
    expect(result.compAndPen.selectedDebts).to.have.length(1);
    expect(result.education).to.be.null;
  });

  it('handles form with no selected debts', () => {
    const noDebtsForm = {
      data: {
        ...mockForm.data,
        selectedDebts: [],
      },
    };

    const result = transformForSubmit(mockFormConfig, noDebtsForm);

    expect(result.education).to.be.null;
    expect(result.compAndPen).to.be.null;
  });

  it('handles missing veteran information gracefully', () => {
    const incompleteForm = {
      data: {
        veteran: {
          fullName: {
            first: 'John',
            last: 'Doe',
          },
        },
        selectedDebts: [
          {
            id: '1',
            deductionCode: '44',
            amount: 1000,
          },
        ],
      },
    };

    const result = transformForSubmit(mockFormConfig, incompleteForm);

    expect(result.education).to.exist;
    expect(result.education.veteran.veteranFullName.first).to.equal('John');
    expect(result.education.veteran.veteranFullName.last).to.equal('Doe');
    expect(result.education.veteran.veteranFullName.middle).to.be.undefined;
    expect(result.education.veteran.dob).to.be.undefined;
  });

  it('preserves debt properties in transformed data', () => {
    const result = transformForSubmit(mockFormConfig, mockForm);

    const educationDebt = result.education.selectedDebts[0];
    expect(educationDebt.id).to.equal('2');
    expect(educationDebt.amount).to.equal(2000);
    expect(educationDebt.reason).to.equal('Test reason 2');

    const compPenDebt = result.compAndPen.selectedDebts[0];
    expect(compPenDebt.id).to.equal('1');
    expect(compPenDebt.amount).to.equal(1000);
    expect(compPenDebt.reason).to.equal('Test reason 1');
  });
});
