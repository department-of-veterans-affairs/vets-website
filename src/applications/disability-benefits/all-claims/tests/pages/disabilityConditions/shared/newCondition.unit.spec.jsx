import 'platform/testing/unit/mocha-setup';
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import newConditionPage from '../../../../pages/disabilityConditions/shared/newCondition';
import formConfig from '../../../../config/form';
import { arrayOptions } from '../../../../pages/disabilityConditions/shared/utils';

const mountPage = (data = {}, onSubmit = () => {}) => {
  const seed = {
    [arrayOptions.arrayPath]: [{}],
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
    const AllHeadingsLvl4 = container.querySelectorAll('h4');
    const secondHeading = AllHeadingsLvl4[1];

    expect(secondHeading).to.exist;
    expect(secondHeading.textContent).to.equal(
      'If your condition isn’t listed',
    );
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
      'Start typing for a list of conditions.',
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

  it('shows error when input is only whitespace', async () => {
    const { getByRole, findByText, getByTestId } = mountPage();
    const input = getByTestId('autocomplete-input');
    input.value = '   ';

    fireEvent.input(input);
    fireEvent.click(getByRole('button', { name: /submit/i }));

    const error = await findByText(
      /Enter a condition, diagnosis, or short description/i,
    );
    expect(error).to.exist;
  });

  it('shows error when input exceeds 255 characters', async () => {
    const { getByRole, findByText, getByTestId } = mountPage();
    const input = getByTestId('autocomplete-input');
    input.value = 'a'.repeat(256);

    fireEvent.input(input);
    fireEvent.click(getByRole('button', { name: /submit/i }));

    const error = await findByText(
      /This field should be less than 255 characters/i,
    );
    expect(error).to.exist;
  });
});
