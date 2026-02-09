import { expect } from 'chai';
import { getCustomValidationErrors } from '../../utils/customValidationErrors';

describe('getCustomValidationErrors', () => {
  it('should return error when view:claimingNew is true and newDisabilities is empty', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': true,
      },
      newDisabilities: [],
    };

    const errors = getCustomValidationErrors(formData);

    expect(errors.length).to.equal(1);
    expect(errors[0].property).to.equal('instance.newDisabilities');
    expect(errors[0].name).to.equal('minItems');
    expect(errors[0].argument).to.equal(1);
  });

  it('should return error when view:claimingNew is true and newDisabilities is missing', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': true,
      },
    };

    const errors = getCustomValidationErrors(formData);

    expect(errors.length).to.equal(1);
    expect(errors[0].property).to.equal('instance.newDisabilities');
    expect(errors[0].name).to.equal('minItems');
  });

  it('should return error when view:claimingNew is true and newDisabilities is not an array', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': true,
      },
      newDisabilities: 'not an array',
    };

    const errors = getCustomValidationErrors(formData);

    expect(errors.length).to.equal(1);
    expect(errors[0].property).to.equal('instance.newDisabilities');
  });

  it('should not return error when view:claimingNew is false', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': false,
      },
      newDisabilities: [],
    };

    const errors = getCustomValidationErrors(formData);

    expect(errors.length).to.equal(0);
  });

  it('should not return error when view:claimingNew is missing', () => {
    const formData = {
      newDisabilities: [],
    };

    const errors = getCustomValidationErrors(formData);

    expect(errors.length).to.equal(0);
  });

  it('should not return error when view:claimingNew is true and newDisabilities has items', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': true,
      },
      newDisabilities: [{ condition: 'Test condition' }],
    };

    const errors = getCustomValidationErrors(formData);

    expect(errors.length).to.equal(0);
  });

  it('should handle null formData gracefully', () => {
    const errors = getCustomValidationErrors(null);

    expect(errors.length).to.equal(0);
  });

  it('should handle undefined formData gracefully', () => {
    const errors = getCustomValidationErrors(undefined);

    expect(errors.length).to.equal(0);
  });
});
