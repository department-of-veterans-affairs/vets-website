import { expect } from 'chai';
import { getCustomValidationErrors } from '../../utils/customValidationErrors';

describe('getCustomValidationErrors', () => {
  it('should return error when any claim type is true and newDisabilities is empty', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': true,
        'view:claimingIncrease': false,
      },
      newDisabilities: [],
    };

    const errors = getCustomValidationErrors(formData);

    expect(errors.length).to.equal(1);
    expect(errors[0].property).to.equal('instance.newDisabilities');
    expect(errors[0].name).to.equal('minItems');
    expect(errors[0].argument).to.equal(1);
  });

  it('should return error when any claim type is true and newDisabilities is missing', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': true,
        'view:claimingIncrease': false,
      },
    };

    const errors = getCustomValidationErrors(formData);

    expect(errors.length).to.equal(1);
    expect(errors[0].property).to.equal('instance.newDisabilities');
    expect(errors[0].name).to.equal('minItems');
  });

  it('should return error when any claim type is true and newDisabilities is not an array', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': true,
        'view:claimingIncrease': false,
      },
      newDisabilities: 'not an array',
    };

    const errors = getCustomValidationErrors(formData);

    expect(errors.length).to.equal(1);
    expect(errors[0].property).to.equal('instance.newDisabilities');
  });

  it('should not return error when claimType is missing', () => {
    const formData = {
      newDisabilities: [],
    };

    const errors = getCustomValidationErrors(formData);

    expect(errors.length).to.equal(0);
  });

  it('should not return error when any claim type is true and newDisabilities has items', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': true,
        'view:claimingIncrease': false,
      },
      newDisabilities: [{ condition: 'Test condition' }],
    };

    const errors = getCustomValidationErrors(formData);

    expect(errors.length).to.equal(0);
  });

  it('should return error when both flags are false but at least one condition has ratedDisability', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': false,
        'view:claimingIncrease': false,
      },
      newDisabilities: [
        {
          condition: 'Knee pain',
          ratedDisability: "A condition I haven't claimed before",
        },
      ],
    };

    const errors = getCustomValidationErrors(formData);

    expect(errors.length).to.equal(1);
    expect(errors[0].property).to.equal('instance.view:claimType');
  });

  it('should not return error when both flags are false but no condition has ratedDisability', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': false,
        'view:claimingIncrease': false,
      },
      newDisabilities: [
        {
          primaryDescription: 'a',
          cause: 'NEW',
          sideOfBody: 'RIGHT',
          condition: 'ACL tear (anterior cruciate ligament tear)',
        },
      ],
    };

    const errors = getCustomValidationErrors(formData);

    expect(errors.length).to.equal(0);
  });

  it('should return error when both flags are false and newDisabilities contains only an empty object', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': false,
        'view:claimingIncrease': false,
      },
      newDisabilities: [{}],
    };

    const errors = getCustomValidationErrors(formData);

    expect(errors.length).to.equal(1);
    expect(errors[0].property).to.equal('instance.view:claimType');
  });

  it('should return error when both flags are false and newDisabilities is empty', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': false,
        'view:claimingIncrease': false,
      },
      newDisabilities: [],
    };

    const errors = getCustomValidationErrors(formData);

    expect(errors.length).to.equal(1);
    expect(errors[0].property).to.equal('instance.view:claimType');
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
