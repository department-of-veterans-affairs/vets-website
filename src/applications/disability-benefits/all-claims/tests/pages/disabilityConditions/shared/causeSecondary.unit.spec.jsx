import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import causeSecondaryPage from '../../../../pages/disabilityConditions/shared/causeSecondary';
import formConfig from '../../../../config/form';
import { arrayOptions } from '../../../../pages/disabilityConditions/shared/utils';

const mountPage = (data = {}, onSubmit = () => {}) => {
  const seed = {
    [arrayOptions.arrayPath]: [{}],
  };
  return render(
    <DefinitionTester
      definitions={formConfig.defaultDefinitions}
      schema={causeSecondaryPage.schema}
      uiSchema={causeSecondaryPage.uiSchema}
      data={{ ...seed, ...data }}
      onSubmit={onSubmit}
    />,
  );
};

describe('526 cause secondary shared page', () => {
  afterEach(() => {
    cleanup();
  });

  it('shows an <h3> “Condition” heading', () => {
    const { container } = mountPage();

    const heading = container.querySelector('h3');

    expect(heading).to.exist;
    expect(heading.textContent).to.equal('Condition');
  });

  it('renders the correct label text on <va-select>', () => {
    const { container } = mountPage();
    const selectContainer = container.querySelector('va-select');

    expect(selectContainer).to.exist;
    expect(selectContainer.getAttribute('label')).to.equal(
      'Choose the service-connected disability or condition that caused condition.',
    );
  });

  it('renders the correct label text on <va-textarea>', () => {
    const { container } = mountPage();
    const textareaContainer = container.querySelector('va-textarea');

    expect(textareaContainer).to.exist;
    expect(textareaContainer.getAttribute('label')).to.equal(
      'Briefly describe how this disability or condition caused condition.',
    );
  });

  it('shows required error when <va-textarea>or <va-select> left blank', async () => {
    const { container, getByRole } = mountPage();

    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(
      () => {
        const selectEl = container.querySelector('va-select');
        const textareaEl = container.querySelector('va-textarea');

        expect(selectEl).to.have.attribute(
          'error',
          'You must provide a response',
        );
        expect(textareaEl).to.have.attribute(
          'error',
          'You must provide a response',
        );
      },
      { timeout: 2000 },
    );
  });

  it('submits after the user chooses a connected disability and adds a description', async () => {
    const spy = sinon.spy();

    const testData = {
      ratedDisabilities: [{ name: 'tinnitus' }],
      causedByDisability: 'tinnitus',
      causedByDisabilityDescription: 'Tinnitus aggravated my anxiety.',
    };

    const { getByRole } = mountPage(testData, spy);

    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(spy.calledOnce).to.be.true);
  });
});
