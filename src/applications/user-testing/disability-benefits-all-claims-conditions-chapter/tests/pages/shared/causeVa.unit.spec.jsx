import 'platform/testing/unit/mocha-setup';
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import causeVA from '../../../pages/shared/causeVA';
import formConfig from '../../../config/form';
import { arrayBuilderOptions } from '../../../pages/shared/utils';

const mountPage = (data = {}, onSubmit = () => {}) => {
  const seed = {
    [arrayBuilderOptions.arrayPath]: [{}],
  };
  return render(
    <DefinitionTester
      definitions={formConfig.defaultDefinitions}
      schema={causeVA.schema}
      uiSchema={causeVA.uiSchema}
      data={{ ...seed, ...data }}
      onSubmit={onSubmit}
    />,
  );
};

describe('526 cause va shared page', () => {
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
      'Briefly describe the injury or event in VA care that caused your condition.',
    );
  });

  it('renders the correct label text on <va-text-input>', () => {
    const { container } = mountPage();
    const textareaContainer = container.querySelector('va-text-input');

    expect(textareaContainer.getAttribute('label')).to.equal(
      'Tell us where this happened.',
    );
  });

  it('shows required error when description and location blank', async () => {
    const { container, getByRole } = mountPage();

    fireEvent.click(getByRole('button', { name: /submit/i }));

    const textareaContainer = container.querySelector(
      'va-textarea[name="root_vaMistreatmentDescription"]',
    );
    const locationEl = container.querySelector(
      'va-text-input[name="root_vaMistreatmentLocation"]',
    );

    await waitFor(() => {
      expect(textareaContainer).to.have.attribute(
        'error',
        'You must provide a response',
      );
      expect(locationEl).to.have.attribute(
        'error',
        'You must provide a response',
      );
    });
  });

  it('shows required error when description provided but not location', async () => {
    const spy = sinon.spy();
    const { container, getByRole } = mountPage(
      {
        vaMistreatmentDescription: 'My knee twisted during PT.',
      },
      spy,
    );

    fireEvent.click(getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      const textareaContainer = container.querySelector('va-textarea');
      const textinput = container.querySelector('va-text-input');
      expect(textareaContainer).not.to.have.attribute('error');
      expect(textinput).to.have.attribute('error');
    });
  });

  it('shows required error when location provided but not description', async () => {
    const spy = sinon.spy();
    const { container, getByRole } = mountPage(
      {
        vaMistreatmentLocation: 'Somewhere USA',
      },
      spy,
    );

    fireEvent.click(getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      const textarea = container.querySelector('va-textarea');
      const textinput = container.querySelector('va-text-input');
      expect(textarea).to.have.attribute('error');
      expect(textinput).not.to.have.attribute('error');
    });
  });

  it('submits when user enters a description and specifies a location', async () => {
    const spy = sinon.spy();
    const { container, getByRole } = mountPage(
      {
        vaMistreatmentDescription: 'My knee twisted during PT.',
        vaMistreatmentLocation: 'Somewhere USA',
      },
      spy,
    );

    fireEvent.click(getByRole('button', { name: /submit/i }));
    await waitFor(() => expect(spy.calledOnce).to.be.true);

    const textareaContainer = container.querySelector('va-textarea');
    expect(textareaContainer).not.to.have.attribute('error');
  });

  it('shows an error when input exceeds the limit', async () => {
    const long = 'x'.repeat(400);
    const { container, getByRole } = mountPage({
      vaMistreatmentDescription: long,
    });

    fireEvent.click(getByRole('button', { name: /submit/i }));

    const field = container.querySelector(
      'va-textarea[name="root_vaMistreatmentDescription"]',
    );

    await waitFor(() => expect(field).to.have.attribute('error'));
  });
});
