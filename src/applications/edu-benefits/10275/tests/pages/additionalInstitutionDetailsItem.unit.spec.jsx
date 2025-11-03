import { expect } from 'chai';
import { uiSchema } from '../../pages/additionalInstitutionDetailsItem';

describe('Additional Institution Details Item page', () => {
  it('should validate facility code format and show error for invalid code', () => {
    const errors = {
      messages: [],
      addError(msg) {
        this.messages.push(msg);
      },
    };

    const validate = uiSchema.facilityCode['ui:validations'][0];
    validate(errors, '1234567', { institutionDetails: {} });
    expect(errors.messages).to.include(
      'Please enter a valid 8-character facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
    );
    errors.messages = [];
    validate(errors, '1234567!', { institutionDetails: {} });
    expect(errors.messages).to.include(
      'Please enter a valid 8-character facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
    );
    errors.messages = [];
    validate(errors, '12345678', { institutionDetails: {} });
    expect(errors.messages).to.be.empty;
  });

  it('should show error when institution is not found', () => {
    const errors = {
      messages: [],
      addError(msg) {
        this.messages.push(msg);
      },
    };

    const validate = uiSchema.facilityCode['ui:validations'][0];
    const fieldData = '12345678';
    const formData = {
      institutionDetails: { institutionName: 'not found' },
    };

    validate(errors, fieldData, formData);

    expect(errors.messages).to.include(
      'Please enter a valid 8-character facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
    );
  });

  it('should show error when institution is ineligible for POE', () => {
    const errors = {
      messages: [],
      addError(msg) {
        this.messages.push(msg);
      },
    };

    const validate = uiSchema.facilityCode['ui:validations'][0];
    const fieldData = '12345678';
    const formData = {
      institutionDetails: { poeEligible: false },
    };

    validate(errors, fieldData, formData);

    expect(errors.messages).to.include(
      'This institution is unable to participate in the Principles of Excellence.',
    );
  });
});
