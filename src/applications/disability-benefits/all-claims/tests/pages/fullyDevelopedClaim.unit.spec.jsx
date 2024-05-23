import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
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
    const { getByText, getByLabelText } = render(
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
    getByText('Learn more about the FDC program');
    getByText('View the evidence requirements for disability claims');

    // question with options
    getByText('Do you want to apply using the Fully Developed Claim program?');
    getByLabelText(yesLabel);
    getByLabelText(noLabel);
  });

  it('should display error when missing required field', () => {
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
    getByText('You must provide a response');
    expect(onSubmit.calledOnce).to.be.false;
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
