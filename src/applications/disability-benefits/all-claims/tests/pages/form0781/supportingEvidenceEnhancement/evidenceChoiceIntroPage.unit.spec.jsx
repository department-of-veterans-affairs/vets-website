import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@testing-library/react';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import formConfig from '../../../../config/form';

describe('evidenceChoiceIntroPage', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.supportingEvidence.pages.evidenceChoiceIntro;
  //   TODO update the variable name once evidence-choice-upload page is created
  const {
    depends: tempEvidenceChoiceAdditionalDocuments,
  } = formConfig.chapters.supportingEvidence.pages.evidenceChoiceAdditionalDocuments;
  const summaryOfEvidencePage =
    formConfig.chapters.supportingEvidence.pages.summaryOfEvidence;
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
      'Are there any supporting documents or additional forms that you want us to review with your claim?',
    );

    expect(container.querySelector('va-radio-option[label="Yes"', container)).to
      .exist;
    expect(container.querySelector('va-radio-option[label="No"', container)).to
      .exist;
  });
  // Testing submission behavior with radio buttons
  it('should error when veteran makes no selection', async () => {
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

    const submitButton = getByText('Submit');
    userEvent.click(submitButton);
    await waitFor(() => {
      expect(onSubmit.calledOnce).to.be.false;
      expect($('va-radio').error).to.eq('You must provide a response');
    });
  });

  it('should submit when veteran selects "yes" to add additional forms/supporting documents', () => {
    const onSubmit = sinon.spy();
    const { getByText } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidenceChoice': true,
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    const submitButton = getByText('Submit');
    userEvent.click(submitButton);
    expect(onSubmit.calledOnce).to.be.true;
    expect($('va-radio').error).to.be.null;
  });

  // Testing radio buttons to move between evidence-choice-upload page and summary of evidence page
  // TODO update test when new evidence-choice-upload page is created
  it('should show evidence-choice-upload(eventually) page when veteran selects "Yes" and feature flag is enabled', () => {
    const formData = {
      'view:hasEvidenceChoice': true, // Veteran selected YES
      //   TODO remove feature toggle when enhancement is fully launched
      disability526SupportingEvidenceEnhancement: true, // feature toggle ON
    };
    expect(tempEvidenceChoiceAdditionalDocuments(formData)).to.be.true;
  });
  it('should not show evidence-choice-upload page when veteran selects "No" and show the summary of evidence page', () => {
    const formData = {
      'view:hasEvidenceChoice': false, // Veteran selected NO
      //   TODO remove feature toggle when enhancement is fully launched
      disability526SupportingEvidenceEnhancement: true, // feature toggle ON
    };
    expect(tempEvidenceChoiceAdditionalDocuments(formData)).to.be.false;
    expect(summaryOfEvidencePage).to.exist;
    expect(summaryOfEvidencePage.path).to.equal('supporting-evidence/summary');
  });

  describe('schema', () => {
    it('should have required properties for view:hasEvidenceChoice', () => {
      expect(schema.required).to.include('view:hasEvidenceChoice');
    });
  });
});
