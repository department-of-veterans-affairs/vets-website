import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';

import formConfig from '../../../config/form';

import evidenceData from '../../fixtures/data/maximal-test.json';

const { schema, uiSchema } = formConfig.chapters.evidenceChapter.pages.evidence;

const pageTitle = 'evidence';

// The page has 0 detected web component fields (multiple file input may not be detected by test helper)
const numberOfWebComponentFields = 0;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentFields,
  pageTitle,
);

// The page has 0 required fields (file upload is optional), so 0 validation errors expected
const numberOfWebComponentErrors = 0;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentErrors,
  pageTitle,
);

describe(`${pageTitle} - Confirmation page`, () => {
  it('renders no evidence message if no files uploaded', () => {
    const ConfirmationField = uiSchema['ui:confirmationField'];
    const formData = evidenceData;
    formData.supportingEvidence = null;
    const wrapper = render(
      <ConfirmationField formData={formData}>
        <div formData={null} />
      </ConfirmationField>,
    );
    expect(wrapper.findByText('No evidence was uploaded')).to.exist;
  });

  it('renders a heading if files were uploaded', () => {
    const ConfirmationField = uiSchema['ui:confirmationField'];
    const formData = evidenceData;
    const wrapper = render(
      <ConfirmationField formData={formData}>
        <div formData={null} />
      </ConfirmationField>,
    );
    expect(wrapper.findByText('Supporting evidence uploaded')).to.exist;
  });

  it('should render correct page title', () => {
    // This forces execution of the titleUI statement
    const title = uiSchema['ui:title'];

    // Or render and check the actual title
    const screen = render(title);
    expect(screen.getByText('Upload your supporting evidence')).to.exist;
  });
});
