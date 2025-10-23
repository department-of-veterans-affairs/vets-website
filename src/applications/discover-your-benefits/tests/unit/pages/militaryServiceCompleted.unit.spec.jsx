import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import militaryServiceCompleted from '../../../pages/militaryServiceCompleted';

describe('Military Service Completed Form', () => {
  let wrapper;

  const setupForm = (data = {}) =>
    render(
      <DefinitionTester
        schema={militaryServiceCompleted.schema}
        uiSchema={militaryServiceCompleted.uiSchema}
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
      'va-radio[label="Have you ever completed a previous period of military service?"]',
    );
    expect(title).to.exist;
  });

  it('renders the correct hint', () => {
    const title = document.querySelector(
      'va-radio[hint="This includes active-duty service and service in the National Guard and Reserves."]',
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
