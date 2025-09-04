import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { waitFor } from '@testing-library/dom';
import formConfig from '../../config/form';

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

  it('should error when user makes no selection', async () => {
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

  // TODO: Implementing 4142 and will need flipper
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

  // 'No' radio button selected and acknowledgment checked allows user to submit
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

  it('should render the auth question section when disability526Enable2024Form4142 is false', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:uploadPrivateRecordsQualifier': {
            'view:hasPrivateRecordsToUpload': false,
          },
          disability526Enable2024Form4142: false, // Simulating the condition
        }}
        formData={{}}
      />,
    );
    // checkbox should be rendered
    expect(form.find('input[type="checkbox"]').length).to.equal(1);
    form.unmount();
  });

  // When the disability526Enable2024Form4142 is true, the auth section should not render on this page because it is
  // present on the next page instead in the new experience.
  it('should NOT render the auth section when disability526Enable2024Form4142 is true', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:uploadPrivateRecordsQualifier': {
            'view:hasPrivateRecordsToUpload': false,
          },
          disability526Enable2024Form4142: true, // Simulating the condition
        }}
        formData={{}}
      />,
    );
    expect(form.find('input[type="checkbox"]').length).to.equal(0);
    form.unmount();
  });
});
