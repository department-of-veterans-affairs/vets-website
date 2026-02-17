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
import { waitFor } from '@testing-library/dom';
import formConfig from '../../config/form';
import { updateFormData } from '../../pages/evidenceTypes';

describe('evidenceTypes', () => {
  const { schema, uiSchema } =
    formConfig.chapters.supportingEvidence.pages.evidenceTypes;

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect($$('va-radio-option').length).to.equal(2);

    const question = container.querySelector('va-radio');
    expect(question).to.have.attribute(
      'label',
      'Is there any evidence you’d like us to review as part of your claim?',
    );

    expect(container.querySelector('va-radio-option[label="Yes"', container)).to
      .exist;
    expect(container.querySelector('va-radio-option[label="No"', container)).to
      .exist;
  });

  it('should submit when no evidence selected', () => {
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

  it('should require at least one evidence type when evidence selected', async () => {
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
    // Error text should be present.
    await waitFor(() => {
      expect(onSubmit.called).to.be.false;
      expect($('va-checkbox-group').error).to.include(
        'Please select at least one type of supporting evidence',
      );
    });
  });

  it('should submit with all required info', async () => {
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
    const checkboxGroup = $('va-checkbox-group', container);
    await checkboxGroup.__events.vaChange({
      target: { checked: true, dataset: { key: 'hasVaMedicalRecords' } },
      detail: { checked: true },
    });
    const submitButton = getByText(/submit/i);
    userEvent.click(submitButton);
    expect(onSubmit.calledOnce).to.be.true;
    // Check for absence of an error message.
    expect($('va-radio').error).to.be.null;
  });

  describe('updateFormData', () => {
    it('should map view:hasMedicalRecords to view:hasEvidence when legacy field missing', () => {
      [true, false].forEach(value => {
        const oldFormData = { 'view:hasMedicalRecords': value };
        const formData = {};
        const result = updateFormData(oldFormData, formData);
        expect(result).to.deep.equal({
          'view:hasEvidence': value,
        });
      });
    });

    it('should not map when both enhancement and legacy fields exist', () => {
      const oldFormData = {
        'view:hasMedicalRecords': true,
      };
      const formData = {
        'view:hasEvidence': false,
      };
      const result = updateFormData(oldFormData, formData);
      expect(result).to.deep.equal({
        'view:hasEvidence': false,
      });
    });

    it('should not map when enhancement field does not exist', () => {
      const oldFormData = {};
      const formData = {
        'view:hasEvidence': true,
      };
      const result = updateFormData(oldFormData, formData);
      expect(result).to.deep.equal({
        'view:hasEvidence': true,
      });
    });

    it('should return formData unchanged when no mapping is needed', () => {
      const oldFormData = {};
      const formData = {
        someOtherField: 'value',
      };
      const result = updateFormData(oldFormData, formData);
      expect(result).to.deep.equal({
        someOtherField: 'value',
      });
    });

    it('should preserve existing formData fields when mapping', () => {
      const oldFormData = {
        'view:hasMedicalRecords': true,
      };
      const formData = {
        existingField: 'existingValue',
      };
      const result = updateFormData(oldFormData, formData);
      expect(result).to.deep.equal({
        existingField: 'existingValue',
        'view:hasEvidence': true,
      });
    });
  });
});
