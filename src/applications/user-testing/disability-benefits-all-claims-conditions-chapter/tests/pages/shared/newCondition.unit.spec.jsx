import 'platform/testing/unit/mocha-setup';
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import newConditionPage from '../../../pages/shared/newCondition';
import formConfig from '../../../config/form';
import { arrayBuilderOptions } from '../../../pages/shared/utils';

const simulateInputChange = (element, value) => {
  const el = element;
  el.value = value;

  const evt = new Event('input', { bubbles: true, composed: true });
  const customEvt = new CustomEvent('input', {
    detail: { value },
    bubbles: true,
    composed: true,
  });

  el.dispatchEvent(evt);
  el.dispatchEvent(customEvt);

  if (el.onInput) {
    el.onInput({ target: { value } });
  }
};

const mountPage = (data = {}, onSubmit = () => {}) => {
  const seed = {
    [arrayBuilderOptions.arrayPath]: [{}],
  };
  return render(
    <DefinitionTester
      definitions={formConfig.defaultDefinitions}
      schema={newConditionPage.schema}
      uiSchema={newConditionPage.uiSchema}
      data={{ ...seed, ...data }}
      onSubmit={onSubmit}
    />,
  );
};

describe('526 new condition shared page', () => {
  afterEach(() => {
    cleanup();
  });

  it('shows an <h3> "Add new condition” heading', () => {
    const { container } = mountPage();

    const heading = container.querySelector('h3');

    expect(heading).to.exist;
    expect(heading.textContent).to.equal('Add new condition');
  });

  it('renders the "If your condition isn’t listed" heading', () => {
    const { container } = mountPage();
    const heading = container.querySelector('h4');

    expect(heading).to.exist;
    expect(heading.textContent).to.equal('If your condition isn’t listed');
  });

  it('renders the instructional text for adding a new condition', () => {
    const { container } = mountPage();
    const paragraphs = container.querySelectorAll('p');
    const instructionText = paragraphs[0].textContent;

    expect(instructionText).to.include(
      'Add a condition that you haven’t claimed before',
    );
  });

  it('renders the correct label and hint text on <va-text-input>', () => {
    const { container } = mountPage();
    const textInputContainer = container.querySelector('va-text-input');

    expect(textInputContainer).to.exist;
    expect(textInputContainer.getAttribute('label')).to.equal(
      'Select or enter condition',
    );
    expect(textInputContainer.getAttribute('hint')).to.equal(
      'Choose from the automatic suggestions or enter your own response.',
    );
  });

  it('renders the examples of conditions list', () => {
    const { container } = mountPage();
    const listItems = container.querySelectorAll('ul li');

    expect(listItems).to.have.lengthOf(3);
    expect(listItems[0].textContent).to.include(
      'PTSD (post-traumatic stress disorder)',
    );
    expect(listItems[1].textContent).to.include('Hearing loss');
    expect(listItems[2].textContent).to.include('Ankylosis in knee');
  });

  it('shows required error when no value for text input is provided', async () => {
    const spy = sinon.spy();
    const { getByRole, findByText } = mountPage({}, spy);

    fireEvent.click(getByRole('button', { name: /submit/i }));

    const error = await findByText(
      /Enter a condition, diagnosis, or short description/i,
    );
    expect(error).to.exist;
  });

  it('submits when a condition is entered', async () => {
    const onSubmit = sinon.spy();
    const { getByTestId, getByRole } = mountPage({}, onSubmit);
    const input = getByTestId('autocomplete-input');

    simulateInputChange(input, 'migraine');
    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(onSubmit.calledOnce).to.be.true;
      const submittedData = onSubmit.firstCall.args[0];
      expect(submittedData.formData).to.deep.include({
        newCondition: 'migraine',
      });
    });
  });
});
