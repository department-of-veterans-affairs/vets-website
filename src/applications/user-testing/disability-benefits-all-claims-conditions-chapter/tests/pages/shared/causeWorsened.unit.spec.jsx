import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import causeWorsenedPage from '../../../pages/shared/causeWorsened';
import formConfig from '../../../config/form';
import { arrayBuilderOptions } from '../../../pages/shared/utils';

const mountPage = (data = {}, onSubmit = () => {}) => {
  const seed = {
    [arrayBuilderOptions.arrayPath]: [{}],
  };
  return render(
    <DefinitionTester
      definitions={formConfig.defaultDefinitions}
      schema={causeWorsenedPage.schema}
      uiSchema={causeWorsenedPage.uiSchema}
      data={{ ...seed, ...data }}
      onSubmit={onSubmit}
    />,
  );
};

describe('526 cause worsened shared page', () => {
  afterEach(() => {
    cleanup();
  });

  it('shows an <h3> “Condition” heading', () => {
    const { container } = mountPage();

    const heading = container.querySelector('h3');

    expect(heading).to.exist;
    expect(heading.textContent).to.equal('Condition');
  });

  it('renders the correct label text on <va-text-input>', () => {
    const { container } = mountPage();
    const textInputContainer = container.querySelector('va-text-input');

    expect(textInputContainer).to.exist;
    expect(textInputContainer.getAttribute('label')).to.equal(
      'Briefly describe the injury, event or exposure during your military service that caused your condition to get worse.',
    );
  });

  it('renders the correct label text on <va-textarea>', () => {
    const { container } = mountPage();
    const textareaContainer = container.querySelector('va-textarea');

    expect(textareaContainer).to.exist;
    expect(textareaContainer.getAttribute('label')).to.equal(
      'Tell us how condition affected you before your service, and how it affects you now after your service.',
    );
  });

  it('shows required error when description and location blank', async () => {
    const { container, getByRole } = mountPage();

    fireEvent.click(getByRole('button', { name: /submit/i }));

    const descriptionContainer = container.querySelector('va-text-input');
    const locationContainer = container.querySelector('va-text-input');

    await waitFor(() => {
      expect(descriptionContainer).to.have.attribute(
        'error',
        'You must provide a response',
      );
      expect(locationContainer).to.have.attribute(
        'error',
        'You must provide a response',
      );
    });
  });

  it('shows required error when input for value provided but not for textarea', async () => {
    const spy = sinon.spy();
    const { container, getByRole } = mountPage(
      {
        worsenedDescription: 'Tinnitus aggravated my anxiety.',
      },
      spy,
    );

    fireEvent.click(getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      const textareaContainer = container.querySelector('va-textarea');
      const textInputContainer = container.querySelector('va-text-input');
      expect(textareaContainer).to.have.attribute('error');
      expect(textInputContainer).not.to.have.attribute('error');
    });
  });

  it('shows required error when textarea provided but not input value', async () => {
    const spy = sinon.spy();
    const { container, getByRole } = mountPage(
      {
        worsenedEffects: 'tinnitus',
      },
      spy,
    );

    fireEvent.click(getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      const textareaContainer = container.querySelector('va-textarea');
      const textInputContainer = container.querySelector('va-text-input');
      expect(textareaContainer).not.to.have.attribute('error');
      expect(textInputContainer).to.have.attribute('error');
    });
  });

  it('submits after the user enters input text and adds a description in textarea', async () => {
    const spy = sinon.spy();

    const testData = {
      worsenedDescription: 'Tinnitus aggravated my anxiety.',
      worsenedEffects: 'tinnitus',
    };

    const { getByRole } = mountPage(testData, spy);

    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(spy.calledOnce).to.be.true);
  });

  it('truncates worsened effect field to 350 characters', async () => {
    const long = 'x'.repeat(400);

    const { container, getByRole } = mountPage({
      worsenedEffects: long,
    });

    fireEvent.click(getByRole('button', { name: /submit/i }));

    const textareaContainer = container.querySelector(
      'va-textarea[name="root_worsenedEffects"]',
    );

    await waitFor(() =>
      expect(textareaContainer).to.have.attribute(
        'error',
        'This field should be less than 350 characters',
      ),
    );
  });

  it('shows an error when worsened description exceeds 50 on submit', async () => {
    const long = 'x'.repeat(75);
    const { container, getByRole } = mountPage({ worsenedDescription: long });

    fireEvent.click(getByRole('button', { name: /submit/i }));

    const input = container.querySelector(
      'va-text-input[name="root_worsenedDescription"]',
    );

    await waitFor(() =>
      expect(input).to.have.attribute(
        'error',
        'This field should be less than 50 characters',
      ),
    );
  });
});
