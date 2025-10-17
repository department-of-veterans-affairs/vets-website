import { expect } from 'chai';
import formConfig from '../../config/form';
import { AUTHORIZATION_LABEL } from '../../components/Authorization';

const {
  uiSchema,
} = formConfig.chapters.supportingEvidence.pages.privateMedicalAuthorizeRelease;

describe('ui:confirmationField', () => {
  it('should display "Yes" when authorization is given', () => {
    const result = uiSchema.patient4142Acknowledgement['ui:confirmationField']({
      formData: true,
    });
    expect(result).to.deep.equal({
      data: 'Yes',
      label: AUTHORIZATION_LABEL,
    });
  });

  // Authorization is required, so this case should not occur in practice
  it('should display "No" when authorization is not given', () => {
    const result = uiSchema.patient4142Acknowledgement['ui:confirmationField']({
      formData: false,
    });
    expect(result).to.deep.equal({
      data: 'No',
      label: AUTHORIZATION_LABEL,
    });
  });
});
