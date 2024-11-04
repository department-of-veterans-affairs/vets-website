import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import goalsConfig from '../../../pages/goals';

describe('Goals Form', () => {
  let wrapper;

  const setupForm = (data = {}) =>
    render(
      <DefinitionTester
        schema={goalsConfig.schema}
        uiSchema={goalsConfig.uiSchema}
        data={data}
      />,
    );

  beforeEach(() => {
    wrapper = setupForm();
  });

  afterEach(() => {
    wrapper && wrapper.unmount();
  });

  it('should render the correct title for goals checkbox group', () => {
    const checkboxGroup = document.querySelector(
      'va-checkbox-group[label="What goals do you want to accomplish?"]',
    );
    expect(checkboxGroup).to.exist;
  });

  it('should render the correct hint for goals checkbox group', () => {
    const hint = document.querySelector(
      'va-checkbox-group[hint="Check all that apply."]',
    );
    expect(hint).to.exist;
  });

  it('should render the correct checkbox options for goals', () => {
    const options = [
      'Earn a degree or certificate',
      'Find a civilian job',
      'Plan for my transition',
      'Set a career path',
    ];

    options.forEach(option => {
      const checkboxOption = document.querySelector(
        `va-checkbox[label="${option}"]`,
      );
      expect(checkboxOption).to.exist;
    });
  });

  it('should allow multiple selections in the goals checkbox group', () => {
    const firstOption = document.querySelector(
      'va-checkbox[label="Earn a degree or certificate"]',
    );
    const secondOption = document.querySelector(
      'va-checkbox[label="Find a civilian job"]',
    );

    fireEvent(firstOption, new CustomEvent('click'));
    fireEvent(secondOption, new CustomEvent('click'));

    firstOption.checked = true;
    secondOption.checked = true;

    expect(firstOption.checked).to.be.true;
    expect(secondOption.checked).to.be.true;
  });

  it('should allow checkboxes to be unselected', () => {
    const option = document.querySelector(
      'va-checkbox[label="Plan for my transition"]',
    );

    option.checked = true;

    fireEvent(option, new CustomEvent('click'));
    expect(option.checked).to.be.true;

    option.checked = false;

    fireEvent(option, new CustomEvent('click'));
    expect(option.checked).to.be.false;
  });
});
