import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';

describe('526 All Claims Private medical records', () => {
  const page =
    formConfig.chapters.supportingEvidence.pages.privateMedicalRecords;
  const { schema, uiSchema } = page;

  it('should render', () => {
    render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );
    expect($$('va-radio-option').length).to.equal(2);
  });

  it('should error when user makes no selection', () => {
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
    expect(onSubmit.calledOnce).to.be.false;
    expect($('va-radio').error).to.eq('You must provide a response');
  });

  it('should submit when user selects "yes" to upload', () => {
    const onSubmit = sinon.spy();
    const { getByText } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:uploadPrivateRecordsQualifier': {
            'view:hasPrivateRecordsToUpload': true,
          },
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    const submitButton = getByText('Submit');
    userEvent.click(submitButton);
    expect(onSubmit.calledOnce).to.be.true;
    expect($('va-radio').error).to.be.null;
    expect($$('va-checkbox').length).to.equal(0); // Expect the acknowledgment to NOT be on screen
  });

  // TODO: This will change once 4142 is integrated
  it('should not submit when user selects "no" to upload and does NOT check the acknowledgment', () => {
    const onSubmit = sinon.spy();
    const { getByText } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:uploadPrivateRecordsQualifier': {
            'view:hasPrivateRecordsToUpload': false,
          },
          'view:patientAcknowledgement': {
            'view:acknowledgement': false, // The user has NOT checked the acknowledgment
          },
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    const submitButton = getByText('Submit');
    userEvent.click(submitButton);
    expect(onSubmit.calledOnce).to.be.false;
    expect($('va-radio').error).to.be.null;
  });

  // User selected 'No' in the radio button and checked 'yes' in the acknowledgment which allows user to submit
  it('should submit when user selects "no" to upload and checks "yes" for the acknowledgment', () => {
    const onSubmit = sinon.spy();
    const { getByText } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:uploadPrivateRecordsQualifier': {
            'view:hasPrivateRecordsToUpload': false,
          },
          'view:patientAcknowledgement': {
            'view:acknowledgement': true,
          },
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
});
