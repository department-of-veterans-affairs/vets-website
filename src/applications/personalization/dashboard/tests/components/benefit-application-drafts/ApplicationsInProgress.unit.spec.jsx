import { expect } from 'chai';
import {
  MY_VA_SIP_FORMS,
  VA_FORM_IDS,
} from '@department-of-veterans-affairs/platform-forms/constants';
import { getCardHeaders } from '../../../components/benefit-application-drafts/ApplicationsInProgress';

describe('ApplicationsInProgress', () => {
  const getFormMeta = formId =>
    MY_VA_SIP_FORMS.find(form => form.id === formId);

  describe('utility: getCardHeaders', () => {
    describe('forms defined in formArrays', () => {
      it('should return the proper headers for form 22-10275', () => {
        const formId = VA_FORM_IDS.FORM_22_10275;
        const formMeta = getFormMeta(formId);
        const hasBenefit = !!formMeta?.benefit;

        expect(
          getCardHeaders(formId, getFormMeta(formId), hasBenefit),
        ).to.deep.equal({
          formTitle: `VA Form ${formId} (${formMeta.title})`,
          hasCustomPresentableFormId: false,
          isForm: true,
          presentableFormId: `FORM ${formId}`,
        });
      });
    });

    describe('forms with default header values', () => {
      it('should return the proper headers for form 21-509-UPLOAD', () => {
        const formId = VA_FORM_IDS.FORM_21_509_UPLOAD;
        const formMeta = getFormMeta(formId);
        const hasBenefit = !!formMeta?.benefit;

        expect(
          getCardHeaders(formId, getFormMeta(formId), hasBenefit),
        ).to.deep.equal({
          formTitle: `Application for ${formMeta.benefit.toLowerCase()}`,
          hasCustomPresentableFormId: false,
          isForm: false,
          presentableFormId: 'FORM 21-509',
        });
      });

      it('should return the proper headers for form 10-10EZ', () => {
        const formId = VA_FORM_IDS.FORM_10_10EZ;
        const formMeta = getFormMeta(formId);
        const hasBenefit = !!formMeta?.benefit;

        expect(
          getCardHeaders(formId, getFormMeta(formId), hasBenefit),
        ).to.deep.equal({
          formTitle: `Application for ${formMeta.benefit.toLowerCase()}`,
          hasCustomPresentableFormId: false,
          isForm: false,
          presentableFormId: 'FORM 10-10EZ',
        });
      });
    });

    describe('forms with custom configs', () => {
      it('should return the proper headers for a form with formTitle and presentableFormId', () => {
        const formId = 'form0995_form4142';
        const formMeta = getFormMeta(formId);
        const hasBenefit = !!formMeta?.benefit;

        expect(
          getCardHeaders(formId, getFormMeta(formId), hasBenefit),
        ).to.deep.equal({
          formTitle: 'Authorization to release medical information',
          hasCustomPresentableFormId: true,
          isForm: false,
          presentableFormId:
            'Form 21-4142 submitted with Supplemental Claim VA Form 20-0995',
        });
      });

      it('should return the proper headers for a form with formIdLabel', () => {
        const formId = 'form526_form4142';
        const formMeta = getFormMeta(formId);
        const hasBenefit = !!formMeta?.benefit;

        expect(
          getCardHeaders(formId, getFormMeta(formId), hasBenefit),
        ).to.deep.equal({
          formTitle: 'VA Form 21-4142 submitted with VA Form 21-526EZ',
          hasCustomPresentableFormId: false,
          isForm: false,
          presentableFormId: '',
        });
      });

      it('should return the proper headers for a form with formTitle', () => {
        const formId = '21-4142';
        const formMeta = getFormMeta(formId);
        const hasBenefit = !!formMeta?.benefit;

        expect(
          getCardHeaders(formId, getFormMeta(formId), hasBenefit),
        ).to.deep.equal({
          formTitle: 'Authorization to release medical information',
          hasCustomPresentableFormId: false,
          isForm: false,
          presentableFormId: 'FORM 21-4142',
        });
      });
    });
  });
});
