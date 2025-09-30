import 'platform/testing/unit/mocha-setup';
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import causeNewPage from '../../../../pages/disabilityConditions/shared/causeNew';
import formConfig from '../../../../config/form';

const mountPage = (data = {}, onSubmit = () => {}) =>
  render(
    <DefinitionTester
      data={data}
      onSubmit={onSubmit}
      definitions={formConfig.defaultDefinitions}
      schema={causeNewPage.schema}
      uiSchema={causeNewPage.uiSchema}
    />,
  );

describe('526 cause new shared page', () => {
  afterEach(() => {
    cleanup();
  });

  it('shows an <h3> “Condition” heading', () => {
    const { container } = mountPage();

    const heading = container.querySelector('h3');

    expect(heading).to.exist;
    expect(heading.textContent).to.equal('Condition');
  });

  it('renders the correct label text on <va-textarea>', () => {
    const { container } = mountPage();
    const textareaContainer = container.querySelector('va-textarea');

    expect(textareaContainer).to.exist;
    expect(textareaContainer.getAttribute('label')).to.equal(
      'Briefly describe the injury, event, disease, or exposure that caused condition.',
    );
  });

  it('renders the example hint text on <va-textarea>', () => {
    const { container } = mountPage();
    const textareaContainer = container.querySelector('va-textarea');

    expect(textareaContainer.getAttribute('hint')).to.equal(
      'For example, "I operated loud machinery while in the service, and this caused me to lose my hearing."',
    );
  });

  it('shows required error when left blank', async () => {
    const { container, getByRole } = mountPage();

    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      const textarea = container.querySelector('va-textarea');
      expect(textarea).to.have.attribute(
        'error',
        'You must provide a response',
      );
    });
  });

  it('submits when user enters a description', async () => {
    const spy = sinon.spy();
    const { container, getByRole } = mountPage(
      {
        primaryDescription: 'My knee twisted during PT.',
      },
      spy,
    );

    fireEvent.click(getByRole('button', { name: /submit/i }));
    await waitFor(() => expect(spy.calledOnce).to.be.true);

    const textareaContainer = container.querySelector('va-textarea');
    expect(textareaContainer).not.to.have.attribute('error');
  });

  it('renders with correct label and hint text', () => {
    const { container } = mountPage();
    const textareaContainer = container.querySelector('va-textarea');

    expect(textareaContainer).to.have.attribute(
      'label',
      'Briefly describe the injury, event, disease, or exposure that caused condition.',
    );

    expect(textareaContainer.getAttribute('hint')).to.match(
      /operated loud machinery/i,
    );
  });

  it('triggers maxLength error when > 400 chars', async () => {
    const long = 'x'.repeat(450);
    const { container, getByRole } = mountPage({ primaryDescription: long });

    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      const textarea = container.querySelector('va-textarea');
      expect(textarea).to.have.attribute('error');
    });
  });
});
