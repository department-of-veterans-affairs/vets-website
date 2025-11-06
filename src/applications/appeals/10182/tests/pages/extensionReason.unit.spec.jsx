import React from 'react';
import { expect } from 'chai';
import { fireEvent, render, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';
import { ExtensionReasonReviewField } from '../../content/extensionReason';

const { schema, uiSchema } = formConfig.chapters.issues.pages.extensionReason;

describe('extension request page', () => {
  const defaultData = {
    requestingExtension: true,
    extensionReason: 'Lorem ipsum',
  };

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect($('va-textarea', container)).to.exist;
  });

  it('should not allow submit with no value (required)', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{ ...defaultData, extensionReason: '' }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect($('va-textarea', container).outerHTML).to.contain('value=""');
      expect($('va-textarea[error]', container)).to.exist;
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should allow submit with some text', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={defaultData}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect($('va-textarea', container).outerHTML).to.contain(
        'value="Lorem ipsum"',
      );
      expect($('va-textarea[error]', container)).to.not.exist;
      expect(onSubmit.called).to.be.true;
    });
  });
});

describe('ExtensionReasonReviewField', () => {
  it('should render the value', () => {
    const { container } = render(
      <ExtensionReasonReviewField>
        {React.createElement('div', { formData: 'value' })}
      </ExtensionReasonReviewField>,
    );

    expect($('dt', container).textContent).to.equal('Reason for extension');
    expect($('dd', container).textContent).to.equal(
      'Added reason for extension',
    );
  });

  it('should render the missing value error', () => {
    const { container } = render(
      <ExtensionReasonReviewField>
        {React.createElement('div', { formData: null })}
      </ExtensionReasonReviewField>,
    );

    expect($('dt', container).textContent).to.equal('Reason for extension');
    expect($('dd .usa-input-error-message', container).textContent).to.equal(
      'Missing reason for extension',
    );
  });
});
