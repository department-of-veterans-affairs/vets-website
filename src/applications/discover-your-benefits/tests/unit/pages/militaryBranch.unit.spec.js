import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import militaryBranchConfig from '../../../pages/militaryBranch';
import { militaryBranchTypeLabels } from '../../../constants/benefits';

describe('Military Branch Form', () => {
  let wrapper;

  const setupForm = (data = {}) =>
    render(
      <DefinitionTester
        schema={militaryBranchConfig.schema}
        uiSchema={militaryBranchConfig.uiSchema}
        data={data}
      />,
    );

  beforeEach(() => {
    wrapper = setupForm();
  });

  afterEach(() => {
    wrapper && wrapper.unmount();
  });

  it('should render the correct title for military branch checkbox group', () => {
    const checkboxGroup = document.querySelector(
      'va-checkbox-group[label="What branch(es) of the military did you serve in?"]',
    );
    expect(checkboxGroup).to.exist;
  });

  it('should render the correct hint for military branch checkbox group', () => {
    const hint = document.querySelector(
      'va-checkbox-group[hint="Check all that apply."]',
    );
    expect(hint).to.exist;
  });

  it('should render the correct checkbox options for military branch', () => {
    const options = Object.values(militaryBranchTypeLabels);

    options.forEach(option => {
      const checkboxOption = document.querySelector(
        `va-checkbox[label="${option}"]`,
      );
      expect(checkboxOption).to.exist;
    });
  });

  it('should allow multiple selections in the military branch checkbox group', () => {
    const options = Object.values(militaryBranchTypeLabels);

    const firstOption = document.querySelector(
      `va-checkbox[label="${options[0]}"]`,
    );
    const secondOption = document.querySelector(
      `va-checkbox[label="${options[1]}"]`,
    );

    fireEvent(firstOption, new CustomEvent('click'));
    fireEvent(secondOption, new CustomEvent('click'));

    firstOption.checked = true;
    secondOption.checked = true;

    expect(firstOption.checked).to.be.true;
    expect(secondOption.checked).to.be.true;
  });

  it('should allow checkboxes to be unselected', () => {
    const options = Object.values(militaryBranchTypeLabels);

    const option = document.querySelector(`va-checkbox[label="${options[0]}"]`);

    option.checked = true;

    fireEvent(option, new CustomEvent('click'));
    expect(option.checked).to.be.true;

    option.checked = false;

    fireEvent(option, new CustomEvent('click'));
    expect(option.checked).to.be.false;
  });
});
