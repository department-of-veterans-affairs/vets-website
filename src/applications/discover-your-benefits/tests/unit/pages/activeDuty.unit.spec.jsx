import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import activeDutyConfig from '../../../pages/activeDuty';

describe('Active duty Form', () => {
  let wrapper;

  const setupForm = (data = {}) =>
    render(
      <DefinitionTester
        schema={activeDutyConfig.schema}
        uiSchema={activeDutyConfig.uiSchema}
        data={data}
      />,
    );

  beforeEach(() => {
    wrapper = setupForm();
  });

  afterEach(() => {
    wrapper && wrapper.unmount();
  });

  it('renders the correct title', () => {
    const title = document.querySelector(
      'va-radio[label="Were you ever called up to active-duty (Title 10) orders while serving in the National Guard or Reserves?"]',
    );
    expect(title).to.exist;
  });

  it('renders the correct radio options', () => {
    const yesOption = document.querySelector('va-radio-option[label="Yes"]');
    const noOption = document.querySelector('va-radio-option[label="No"]');

    expect(yesOption).to.exist;
    expect(noOption).to.exist;
  });
});
