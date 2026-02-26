import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
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
    const { container, getByText, getByLabelText } = render(
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
    getByText('Do you want to apply using the Fully Developed Claim program?');
    getByLabelText(yesLabel);
    getByLabelText(noLabel);
  });

  it('should display error when missing required field', async () => {
    const onSubmit = sinon.spy();
    const { getByText } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        schema={schema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    userEvent.click(getByText('Submit'));
    await waitFor(() => {
      getByText('You must provide a response');
      expect(onSubmit.calledOnce).to.be.false;
    });
  });

  it('should display alert when selecting yes', () => {
    const onSubmit = sinon.spy();
    const { getByText, getByLabelText } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        schema={schema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    userEvent.click(getByLabelText(yesLabel));
    getByText(
      'Since you’ve uploaded all your supporting documents, your claim will be submitted as a fully developed claim.',
      { exact: false },
    );

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should display alert when selecting no', () => {
    const onSubmit = sinon.spy();
    const { getByText, getByLabelText } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        schema={schema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    userEvent.click(getByLabelText(noLabel));
    getByText(
      'Since you’ll be sending in additional documents later, your application doesn’t qualify for the Fully Developed Claim program. We’ll',
      { exact: false },
    );
    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });
});
