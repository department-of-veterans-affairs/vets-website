import { expect } from 'chai';
import { uiSchema } from '../../pages/additionalInstitutionDetailsItem';

const createErrors = () => ({
  messages: [],
  addError(msg) {
    this.messages.push(msg);
  },
});

const createFormData = overrides => ({
  additionalLocations: [
    {
      facilityCode: '12345678',
      institutionName: 'Valid Institution',
      poeEligible: true,
      isLoading: false,
    },
  ],
  ...overrides,
});

describe('Additional Institution Details Item page', () => {
  it('should validate facility code format and show error for invalid code', () => {
    const validate = uiSchema.facilityCode['ui:validations'][0];
    const formData = createFormData();

    const errors = createErrors();
    validate(errors, '1234567', formData);
    expect(errors.messages).to.include(
      'Please enter a valid 8-character facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
    );

    errors.messages = [];
    validate(errors, '1234567!', formData);
    expect(errors.messages).to.include(
      'Please enter a valid 8-character facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
    );

    errors.messages = [];
    validate(errors, '12345678', formData);
    expect(errors.messages).to.be.empty;
  });

  it('should show error when institution is not found', () => {
    const validate = uiSchema.facilityCode['ui:validations'][0];
    const formData = createFormData({
      additionalLocations: [
        {
          facilityCode: '12345678',
          institutionName: 'not found',
          poeEligible: true,
          isLoading: false,
        },
      ],
    });

    const errors = createErrors();
    validate(errors, '12345678', formData);

    expect(errors.messages).to.include(
      'Please enter a valid 8-character facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
    );
  });

  it('should show error when institution is ineligible for POE', () => {
    const validate = uiSchema.facilityCode['ui:validations'][0];
    const formData = createFormData({
      additionalLocations: [
        {
          facilityCode: '12345678',
          institutionName: 'Valid Institution',
          poeEligible: false,
          isLoading: false,
        },
      ],
    });

    const errors = createErrors();
    validate(errors, '12345678', formData);

    expect(errors.messages).to.include(
      'This institution is unable to participate in the Principles of Excellence.',
    );
  });
});
