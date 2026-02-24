import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import formConfig from '../../config/form';
import {
  schema as pageSchema,
  uiSchema as pageUiSchema,
} from '../../pages/evidenceRequest';

describe('evidenceRequest', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.supportingEvidence.pages.evidenceRequest;

  describe('page module (evidenceRequest.js)', () => {
    it('schema requires view:hasMedicalRecords', () => {
      expect(pageSchema.required).to.include('view:hasMedicalRecords');
    });

    it('schema has view:hasMedicalRecords property', () => {
      expect(pageSchema.properties).to.have.property('view:hasMedicalRecords');
    });

    it('uiSchema has page title', () => {
      expect(pageUiSchema['ui:title']).to.exist;
    });
  });

  describe('rendered via form config', () => {
    it('should render page title and yes/no radios from schema', () => {
      const { container } = render(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
        />,
      );

      const pageTitle = container.querySelector('h3');
      expect(pageTitle?.textContent).to.include(
        'Medical records that support your disability claim',
      );

      expect($$('va-radio-option').length).to.equal(2);
      // Radio label, hint, and Yes/No options asserted in EvidenceRequestPage.unit.spec.jsx
    });

    it('should submit when no medical records selected', () => {
      const onSubmit = sinon.spy();
      const { getByText, container } = render(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
          onSubmit={onSubmit}
        />,
      );

      $('va-radio', container).__events.vaValueChange({
        detail: { value: 'N' },
      });
      const submitButton = getByText(/submit/i);
      userEvent.click(submitButton);
      expect($('va-radio').error).to.be.null;
      expect(onSubmit.calledOnce).to.be.true;
    });

    it('should submit when medical records selected', () => {
      const onSubmit = sinon.spy();
      const { getByText, container } = render(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
          onSubmit={onSubmit}
        />,
      );

      $('va-radio', container).__events.vaValueChange({
        detail: { value: 'Y' },
      });
      const submitButton = getByText(/submit/i);
      userEvent.click(submitButton);
      expect($('va-radio').error).to.be.null;
      expect(onSubmit.calledOnce).to.be.true;
    });

    it('should require a response before submitting', () => {
      const onSubmit = sinon.spy();
      const { getByText } = render(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
          onSubmit={onSubmit}
        />,
      );

      const submitButton = getByText(/submit/i);
      userEvent.click(submitButton);
      expect(onSubmit.called).to.be.false;
    });
  });
});
