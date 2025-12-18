import { expect } from 'chai';
import { uiSchema } from '../../pages/benefitSelectionUpdate';

describe('benefitSelectionUpdate rudisillReview onChange', () => {
  it('should clear changeAnotherBenefit when rudisillReview changes to Yes and changeAnotherBenefit has a value', () => {
    const formData = {
      benefitUpdate: 'chapter33',
      rudisillReview: 'No',
      changeAnotherBenefit: 'chapter30',
    };

    let updatedFormData;
    const onChange = data => {
      updatedFormData = data;
    };

    uiSchema.rudisillReview['ui:onChange']('Yes', 'No', formData, onChange);

    expect(updatedFormData.rudisillReview).to.equal('Yes');
    expect(updatedFormData.changeAnotherBenefit).to.be.undefined;
    expect(updatedFormData.benefitUpdate).to.equal('chapter33');
  });

  it('should clear benefitAppliedFor when rudisillReview changes to Yes and benefitAppliedFor has a value', () => {
    const formData = {
      benefitUpdate: 'chapter33',
      rudisillReview: 'No',
      benefitAppliedFor: 'chapter30',
    };

    let updatedFormData;
    const onChange = data => {
      updatedFormData = data;
    };

    uiSchema.rudisillReview['ui:onChange']('Yes', 'No', formData, onChange);

    expect(updatedFormData.rudisillReview).to.equal('Yes');
    expect(updatedFormData.benefitAppliedFor).to.be.undefined;
    expect(updatedFormData.benefitUpdate).to.equal('chapter33');
  });

  it('should clear both changeAnotherBenefit and benefitAppliedFor when rudisillReview changes to Yes and both have values', () => {
    const formData = {
      benefitUpdate: 'chapter33',
      rudisillReview: 'No',
      changeAnotherBenefit: 'chapter30',
      benefitAppliedFor: 'chapter35',
    };

    let updatedFormData;
    const onChange = data => {
      updatedFormData = data;
    };

    uiSchema.rudisillReview['ui:onChange']('Yes', 'No', formData, onChange);

    expect(updatedFormData.rudisillReview).to.equal('Yes');
    expect(updatedFormData.changeAnotherBenefit).to.be.undefined;
    expect(updatedFormData.benefitAppliedFor).to.be.undefined;
    expect(updatedFormData.benefitUpdate).to.equal('chapter33');
  });

  it('should not clear changeAnotherBenefit and benefitAppliedFor when rudisillReview changes to a value other than Yes', () => {
    const formData = {
      benefitUpdate: 'chapter33',
      rudisillReview: 'Yes',
      changeAnotherBenefit: 'chapter30',
      benefitAppliedFor: 'chapter35',
    };

    let updatedFormData;
    const onChange = data => {
      updatedFormData = data;
    };

    uiSchema.rudisillReview['ui:onChange']('No', 'Yes', formData, onChange);

    // onChange should not be called when changing from Yes to No
    expect(updatedFormData).to.be.undefined;
  });

  it('should keep changeAnotherBenefit and benefitAppliedFor undefined when rudisillReview changes to Yes and both are already undefined', () => {
    const formData = {
      benefitUpdate: 'chapter33',
      rudisillReview: 'No',
    };

    let updatedFormData;
    const onChange = data => {
      updatedFormData = data;
    };

    uiSchema.rudisillReview['ui:onChange']('Yes', 'No', formData, onChange);

    // onChange should not be called when there's nothing to clear
    expect(updatedFormData).to.be.undefined;
  });

  it('should not call onChange when rudisillReview changes from No to No', () => {
    const formData = {
      benefitUpdate: 'chapter33',
      rudisillReview: 'No',
      changeAnotherBenefit: 'chapter30',
    };

    let updatedFormData;
    const onChange = data => {
      updatedFormData = data;
    };

    uiSchema.rudisillReview['ui:onChange']('No', 'No', formData, onChange);

    expect(updatedFormData).to.be.undefined;
  });

  it('should not call onChange when rudisillReview changes from Yes to Yes', () => {
    const formData = {
      benefitUpdate: 'chapter33',
      rudisillReview: 'Yes',
    };

    let updatedFormData;
    const onChange = data => {
      updatedFormData = data;
    };

    uiSchema.rudisillReview['ui:onChange']('Yes', 'Yes', formData, onChange);

    expect(updatedFormData).to.be.undefined;
  });

  it('should preserve other form data when clearing changeAnotherBenefit and benefitAppliedFor', () => {
    const formData = {
      benefitUpdate: 'chapter33',
      rudisillReview: 'No',
      changeAnotherBenefit: 'chapter30',
      benefitAppliedFor: 'chapter35',
      someOtherField: 'someValue',
      anotherField: 'anotherValue',
    };

    let updatedFormData;
    const onChange = data => {
      updatedFormData = data;
    };

    uiSchema.rudisillReview['ui:onChange']('Yes', 'No', formData, onChange);

    expect(updatedFormData.rudisillReview).to.equal('Yes');
    expect(updatedFormData.changeAnotherBenefit).to.be.undefined;
    expect(updatedFormData.benefitAppliedFor).to.be.undefined;
    expect(updatedFormData.benefitUpdate).to.equal('chapter33');
    expect(updatedFormData.someOtherField).to.equal('someValue');
    expect(updatedFormData.anotherField).to.equal('anotherValue');
  });

  it('should clear sponsor information when rudisillReview changes to Yes and sponsor fields have values', () => {
    const formData = {
      benefitUpdate: 'chapter35',
      rudisillReview: 'No',
      benefitAppliedFor: 'chapter35',
      sponsorFullName: {
        first: 'John',
        last: 'Doe',
      },
      sponsorSocialSecurityNumber: '123456789',
    };

    let updatedFormData;
    const onChange = data => {
      updatedFormData = data;
    };

    uiSchema.rudisillReview['ui:onChange']('Yes', 'No', formData, onChange);

    expect(updatedFormData.rudisillReview).to.equal('Yes');
    expect(updatedFormData.benefitAppliedFor).to.be.undefined;
    expect(updatedFormData.sponsorFullName).to.be.undefined;
    expect(updatedFormData.sponsorSocialSecurityNumber).to.be.undefined;
  });

  it('should clear vaFileNumber and view:noSSN when rudisillReview changes to Yes', () => {
    const formData = {
      benefitUpdate: 'chapter35',
      rudisillReview: 'No',
      benefitAppliedFor: 'chapter35',
      sponsorFullName: {
        first: 'Jane',
        last: 'Smith',
      },
      'view:noSSN': true,
      vaFileNumber: '12345678',
    };

    let updatedFormData;
    const onChange = data => {
      updatedFormData = data;
    };

    uiSchema.rudisillReview['ui:onChange']('Yes', 'No', formData, onChange);

    expect(updatedFormData.rudisillReview).to.equal('Yes');
    expect(updatedFormData.benefitAppliedFor).to.be.undefined;
    expect(updatedFormData.sponsorFullName).to.be.undefined;
    expect(updatedFormData['view:noSSN']).to.be.undefined;
    expect(updatedFormData.vaFileNumber).to.be.undefined;
  });

  it('should clear all benefit and sponsor fields together when rudisillReview changes to Yes', () => {
    const formData = {
      benefitUpdate: 'chapter35',
      rudisillReview: 'No',
      changeAnotherBenefit: 'chapter30',
      benefitAppliedFor: 'chapter35',
      sponsorFullName: {
        first: 'John',
        middle: 'A',
        last: 'Doe',
        suffix: 'Jr.',
      },
      sponsorSocialSecurityNumber: '123456789',
      vaFileNumber: '87654321',
      'view:noSSN': false,
    };

    let updatedFormData;
    const onChange = data => {
      updatedFormData = data;
    };

    uiSchema.rudisillReview['ui:onChange']('Yes', 'No', formData, onChange);

    expect(updatedFormData.rudisillReview).to.equal('Yes');
    expect(updatedFormData.changeAnotherBenefit).to.be.undefined;
    expect(updatedFormData.benefitAppliedFor).to.be.undefined;
    expect(updatedFormData.sponsorFullName).to.be.undefined;
    expect(updatedFormData.sponsorSocialSecurityNumber).to.be.undefined;
    expect(updatedFormData.vaFileNumber).to.be.undefined;
    expect(updatedFormData['view:noSSN']).to.be.undefined;
    expect(updatedFormData.benefitUpdate).to.equal('chapter35');
  });
});
