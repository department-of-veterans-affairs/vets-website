import React from 'react';
import { expect } from 'chai';
import { fireEvent, render, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

const yesLabel = 'Yes, I have uploaded all my supporting documents.';
const noLabel =
  'No, I have some extra information that I’ll submit to VA later.';

describe('Fully Developed Claim', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.additionalInformation.pages.fullyDevelopedClaim;

  it('should render', () => {
    const { container, getByText } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        schema={schema}
        data={{}}
        formData={{}}
      />,
    );

    // title
    getByText('Fully developed claim program');

    // paragraph/description content
    getByText('You can apply using the Fully Developed Claim', {
      exact: false,
    });

    // links
    const links = container.querySelectorAll('va-link');
    expect(links).to.have.lengthOf(2);
    expect(links[0].getAttribute('text')).to.equal(
      'Learn more about the FDC program',
    );
    expect(links[1].getAttribute('text')).to.equal(
      'View the evidence requirements for disability claims',
    );

    // question with options
    const radio = container.querySelector('va-radio');
    expect(radio).to.exist;
    expect(radio.getAttribute('label')).to.equal(
      'Do you want to apply using the Fully Developed Claim program?',
    );
    const options = container.querySelectorAll('va-radio-option');
    expect(options).to.have.length(2);
    expect(container.querySelector(`va-radio-option[label="${yesLabel}"]`)).to
      .exist;
    expect(container.querySelector(`va-radio-option[label="${noLabel}"]`)).to
      .exist;
  });

  it('should display error when missing required field', async () => {
    const onSubmit = sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        schema={schema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.click(getByText('Submit'));
    await waitFor(() => {
      expect($('va-radio', container).error).to.equal(
        'You must provide a response',
      );
      expect(onSubmit.calledOnce).to.be.false;
    });
  });

  it('should display alert and allow submit when selecting yes', async () => {
    const onSubmit = sinon.spy();
    const { getByText, container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        schema={schema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    // yesNoReverse: true means 'Y' maps to standardClaim=false (FDC path)
    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'Y' },
    });

    await waitFor(() => {
      getByText(
        'Since you’ve uploaded all your supporting documents, your claim will be submitted as a fully developed claim.',
        { exact: false },
      );
    });

    fireEvent.click(getByText('Submit'));
    await waitFor(() => {
      expect(onSubmit.calledOnce).to.be.true;
    });
  });

  it('should display alert and allow submit when selecting no', async () => {
    const onSubmit = sinon.spy();
    const { getByText, container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        schema={schema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    // yesNoReverse: true means 'N' maps to standardClaim=true (standard claim path)
    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'N' },
    });

    await waitFor(() => {
      getByText(
        'Since you’ll be sending in additional documents later, your application doesn’t qualify for the Fully Developed Claim program. We’ll',
        { exact: false },
      );
    });

    fireEvent.click(getByText('Submit'));
    await waitFor(() => {
      expect(onSubmit.calledOnce).to.be.true;
    });
  });
});
